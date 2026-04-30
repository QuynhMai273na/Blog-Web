export type PostCategory = "Yoga" | "Tài chính" | "Parenting";

export type PostComment = {
  author: string;
  avatar: string;
  body: string;
};

export type PostContentSection = {
  heading: string;
  body: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  categoryLabel: string;
  date: string;
  readTime: string;
  commentCount: number;
  intro: string;
  quote: string;
  sections: PostContentSection[];
  tags: string[];
  comments: PostComment[];
  relatedSlugs: string[];
};

export const posts: Post[] = [
  {
    slug: "yoga-me-bau-ngu-ngon",
    title: "5 động tác yoga giúp mẹ bầu ngủ ngon hơn mỗi tối",
    excerpt:
      "Những tư thế nhẹ nhàng phù hợp cho tam cá nguyệt thứ ba, giúp cơ thể thả lỏng và giấc ngủ đến dễ hơn.",
    category: "Yoga",
    categoryLabel: "Yoga & Sức khỏe",
    date: "15 tháng 4, 2026",
    readTime: "5 phút đọc",
    commentCount: 12,
    intro:
      "Khi mang thai, giấc ngủ trở thành thứ xa xỉ mà mình chưa từng nghĩ mình sẽ thiếu đến vậy. Bụng ngày càng lớn, lưng ngày càng mỏi, và có những đêm mình chỉ mong tìm được một tư thế đủ dịu để cơ thể bớt căng hơn một chút.",
    quote:
      "Yoga không phải để bạn hoàn hảo hơn, mà là để bạn cảm thấy nhẹ nhàng hơn với chính mình.",
    sections: [
      {
        heading: "1. Tư thế con mèo — con bò",
        body: "Tư thế này giúp thư giãn cơ lưng dưới và cải thiện tuần hoàn. Thực hiện nhẹ nhàng, hít thở đều theo từng động tác, khoảng 8 đến 10 lần mỗi tối.",
      },
      {
        heading: "2. Tư thế trẻ em (Child's Pose)",
        body: "Mở rộng hai đầu gối ra để nhường chỗ cho bụng bầu. Đây là tư thế mình yêu thích nhất vì cảm giác được thả lỏng toàn thân rất rõ ràng và dễ chịu.",
      },
      {
        heading: "3. Ngồi gập người nhẹ với gối đỡ",
        body: "Nếu lưng dưới mỏi nhiều, một chiếc gối mỏng ở phần hông sẽ giúp đỡ lực khá tốt. Mình thường giữ tư thế này vài nhịp thở sâu trước khi lên giường.",
      },
    ],
    tags: ["yoga", "mẹ bầu", "sức khỏe", "ngủ ngon"],
    comments: [
      {
        author: "Nguyễn Thảo Linh",
        avatar: "🌸",
        body: "Mình thử tư thế số 2 và ngủ ngon hơn hẳn từ tuần trước. Cảm ơn bạn nhiều nha...",
      },
      {
        author: "Trần Minh Châu",
        avatar: "🌿",
        body: "Bài viết rất hữu ích. Mình sắp vào tam cá nguyệt 3 rồi, sẽ thử ngay tối nay...",
      },
    ],
    relatedSlugs: ["uong-du-nuoc-30-ngay", "giu-thoi-quen-yoga-khi-ban-con"],
  },
  {
    slug: "tiet-kiem-30-phan-tram",
    title: "Cách mình tiết kiệm 30% thu nhập mà không cảm thấy thiếu thốn",
    excerpt:
      "Một vài nguyên tắc nhỏ nhưng bền vững giúp việc tiết kiệm không còn là cảm giác tự ép bản thân.",
    category: "Tài chính",
    categoryLabel: "Tài chính cá nhân",
    date: "10 tháng 4, 2026",
    readTime: "7 phút đọc",
    commentCount: 8,
    intro:
      "Có một giai đoạn mình nghĩ tiết kiệm đồng nghĩa với cắt bỏ niềm vui. Nhưng sau vài năm thử nghiệm, mình nhận ra vấn đề không nằm ở việc chi ít hơn, mà là chi rõ ràng hơn.",
    quote:
      "Tiết kiệm tốt không khiến bạn thấy bị siết lại, mà khiến bạn thấy mình đang chủ động hơn.",
    sections: [
      {
        heading: "1. Tách tiền trước khi tiêu",
        body: "Mình chuyển ngay một phần thu nhập sang tài khoản riêng vào ngày nhận lương để không rơi vào cảm giác 'còn bao nhiêu thì tiêu bấy nhiêu'.",
      },
      {
        heading: "2. Chỉ giữ vài hạng mục chi tiêu thật quan trọng",
        body: "Khi mọi thứ đều là ưu tiên, không gì còn là ưu tiên. Mình chỉ giữ lại những nhóm chi thật sự ảnh hưởng tới sức khỏe, gia đình và công việc.",
      },
    ],
    tags: ["tiết kiệm", "tài chính", "chi tiêu"],
    comments: [
      {
        author: "Mai Hương",
        avatar: "💰",
        body: "Đọc xong thấy việc tiết kiệm bớt đáng sợ hơn nhiều. Phần 'chi rõ ràng hơn' rất đúng.",
      },
    ],
    relatedSlugs: ["uong-du-nuoc-30-ngay", "khi-con-khoc"],
  },
  {
    slug: "uong-du-nuoc-30-ngay",
    title: "Nhật ký 30 ngày uống đủ nước — điều gì đã thay đổi?",
    excerpt:
      "Một thói quen rất nhỏ, nhưng tác động đến năng lượng, làn da và cả cảm giác tỉnh táo trong ngày.",
    category: "Yoga",
    categoryLabel: "Yoga & Sức khỏe",
    date: "1 tháng 4, 2026",
    readTime: "4 phút đọc",
    commentCount: 5,
    intro:
      "Mình luôn nghĩ uống nước là chuyện ai cũng biết. Nhưng biết không đồng nghĩa với việc làm đều. 30 ngày vừa rồi là lúc mình thử nghiêm túc với thói quen đơn giản này.",
    quote:
      "Những thay đổi bền vững thường bắt đầu từ thứ rất nhỏ, lặp lại đủ lâu và đủ tử tế với mình.",
    sections: [
      {
        heading: "1. Da bớt khô và cơ thể đỡ mệt giữa chiều",
        body: "Điều mình nhận ra sớm nhất là cảm giác hụt năng lượng lúc 3 giờ chiều giảm đi đáng kể, nhất là vào những ngày làm việc liên tục.",
      },
      {
        heading: "2. Uống nước dễ hơn khi có nhịp cố định",
        body: "Mình không cố 'uống thật nhiều', chỉ chia thành các mốc nhỏ trong ngày. Cách này nhẹ nhàng hơn và thực tế hơn nhiều.",
      },
    ],
    tags: ["sức khỏe", "thói quen", "uống nước"],
    comments: [
      {
        author: "Khánh Vy",
        avatar: "💧",
        body: "Đúng là phải chia mốc mới dễ theo. Mình hay quên nên đọc bài này thấy rất đồng cảm.",
      },
    ],
    relatedSlugs: ["yoga-me-bau-ngu-ngon", "giu-thoi-quen-yoga-khi-ban-con"],
  },
  {
    slug: "giu-thoi-quen-yoga-khi-ban-con",
    title: "Cách giữ thói quen tập yoga khi bận con nhỏ",
    excerpt:
      "Không cần một buổi tập hoàn hảo, chỉ cần một nhịp đều đủ thật để cơ thể còn nhớ cách được chăm sóc.",
    category: "Parenting",
    categoryLabel: "Parenting",
    date: "28 tháng 3, 2026",
    readTime: "6 phút đọc",
    commentCount: 4,
    intro:
      "Sau khi có con, việc dành trọn một tiếng cho yoga gần như biến mất khỏi lịch của mình. Nhưng mình học được rằng thói quen không cần dài, chỉ cần còn hiện diện.",
    quote:
      "Một bài tập ngắn nhưng đều vẫn tốt hơn rất nhiều so với một kế hoạch đẹp nhưng luôn bị hoãn.",
    sections: [
      {
        heading: "1. Giảm kỳ vọng để giữ nhịp",
        body: "Mình không còn đặt mục tiêu phải tập đủ bài. Có hôm chỉ là 10 phút vươn vai, nhưng nhờ vậy mình không bỏ hẳn.",
      },
      {
        heading: "2. Chọn thời điểm ít cản trở nhất",
        body: "Sáng sớm trước khi con dậy hoặc buổi tối sau khi mọi thứ yên hơn là hai khoảng thời gian mình thấy thực tế nhất.",
      },
    ],
    tags: ["yoga", "mẹ bỉm", "thói quen"],
    comments: [
      {
        author: "Bảo Ngọc",
        avatar: "🧘",
        body: "Mình rất cần lời nhắc là 10 phút cũng được. Đọc xong thấy nhẹ lòng hơn.",
      },
    ],
    relatedSlugs: ["yoga-me-bau-ngu-ngon", "uong-du-nuoc-30-ngay"],
  },
  {
    slug: "khi-con-khoc",
    title: "Khi con khóc mà mình không hiểu tại sao",
    excerpt:
      "Hành trình học cách lắng nghe, chậm lại và bớt tự trách mình trong những ngày làm mẹ nhiều bối rối.",
    category: "Parenting",
    categoryLabel: "Parenting",
    date: "5 tháng 4, 2026",
    readTime: "6 phút đọc",
    commentCount: 10,
    intro:
      "Có những ngày con khóc rất lâu và mình chỉ muốn khóc theo. Làm mẹ khiến mình nhận ra sự bất lực cũng là một phần của yêu thương.",
    quote:
      "Không phải lúc nào hiểu ngay con cũng là yêu con đủ. Có khi yêu là vẫn ở đó, dù mình chưa biết phải làm gì.",
    sections: [
      {
        heading: "1. Bình tĩnh lại trước khi tìm câu trả lời",
        body: "Khi mình hoảng, con càng căng hơn. Điều đầu tiên mình học là hít thở chậm vài nhịp để cơ thể mình lắng xuống trước.",
      },
      {
        heading: "2. Ghi lại những dấu hiệu nhỏ",
        body: "Giờ ngủ, cữ bú, nhiệt độ phòng, âm thanh xung quanh... Những chi tiết nhỏ này giúp mình dần hiểu con hơn theo thời gian.",
      },
    ],
    tags: ["parenting", "em bé", "cảm xúc"],
    comments: [
      {
        author: "Thanh Trúc",
        avatar: "👶",
        body: "Đọc mà thấy được an ủi. Có những hôm mình cũng chỉ biết ôm con và chờ mọi thứ dịu xuống.",
      },
    ],
    relatedSlugs: ["giu-thoi-quen-yoga-khi-ban-con", "tiet-kiem-30-phan-tram"],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slugs: string[]) {
  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => Boolean(post));
}
