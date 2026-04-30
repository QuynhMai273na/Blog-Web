import { createClient } from "@/lib/supabase/client";

type AuthProvider = "email" | "google" | string;

type AuthServiceResult = {
  error: string | null;
  needsEmailConfirmation?: boolean;
};

export async function signInWithGoogle() {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/callback`;

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });
}

export async function signUpWithEmail({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}): Promise<AuthServiceResult> {
  const supabase = createClient();
  const normalizedEmail = email.trim().toLowerCase();
  const provider = await getExistingProvider(normalizedEmail);

  if (provider === "google") {
    return {
      error:
        "Email này đã được dùng để đăng nhập bằng Google. Vui lòng tiếp tục với Google.",
    };
  }

  if (provider === "email") {
    return {
      error:
        "Email này đã có tài khoản. Vui lòng đăng nhập hoặc dùng chức năng quên mật khẩu.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login?verified=1`,
      data: {
        full_name: displayName.trim(),
        name: displayName.trim(),
      },
    },
  });

  if (error) {
    return { error: normalizeAuthError(error.message) };
  }

  return {
    error: null,
    needsEmailConfirmation: !data.session,
  };
}

export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthServiceResult> {
  const supabase = createClient();
  const normalizedEmail = email.trim().toLowerCase();
  const provider = await getExistingProvider(normalizedEmail);

  if (provider === "google") {
    return {
      error:
        "Email này đang đăng nhập bằng Google. Vui lòng chọn “Tiếp tục với Google”.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    return { error: normalizeAuthError(error.message) };
  }

  return { error: null };
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function updateDisplayName(displayName: string) {
  const supabase = createClient();
  const trimmedName = displayName.trim();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ display_name: trimmedName })
    .eq("id", user.id);

  if (profileError) {
    console.error("[profile.name.update]", profileError);
    return { error: "Không thể cập nhật tên hiển thị." };
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      full_name: trimmedName,
      name: trimmedName,
    },
  });

  if (metadataError) {
    console.error("[profile.metadata.update]", metadataError);
  }

  return { error: null };
}

export async function updatePasswordWithCurrentPassword({
  email,
  currentPassword,
  newPassword,
}: {
  email: string;
  currentPassword: string;
  newPassword: string;
}) {
  const supabase = createClient();
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: currentPassword,
  });

  if (verifyError) {
    return { error: normalizeAuthError(verifyError.message) };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: normalizeAuthError(updateError.message) };
  }

  return { error: null };
}

async function getExistingProvider(email: string): Promise<AuthProvider | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("auth_provider")
    .ilike("email", email)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[auth.provider.lookup]", error);
    return null;
  }

  return data?.auth_provider ?? null;
}

function normalizeAuthError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("email not confirmed")) {
    return "Email chưa được xác thực. Vui lòng kiểm tra hộp thư trước khi đăng nhập.";
  }

  if (lowerMessage.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng.";
  }

  if (lowerMessage.includes("already registered")) {
    return "Email này đã có tài khoản.";
  }

  return message;
}
