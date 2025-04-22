const posts = [
  {
    title: "Android App Tester for Multiple Devices",
    budget: "$10",
    description: "Eyta hobe description ekhane usfdgkfdgkdlsfjkdfjdskfjkdjkd",
    skills: ["skill 1", "skill 2", "skill 3", "skill 4"],
    client: "habibul pantho",
    date: "2025-03-22",
    file: "asd/fdsj/fdsj.doc",
    location: "Bangladesh",
    paymentVerified: true,
    bids: 4,
  },
  {
    title: "iOS Developer Needed for App Testing",
    budget: "$15",
    description:
      "Looking for an experienced iOS developer for app testing in multiple environments.",
    skills: ["skill 2", "skill 4", "skill 5"],
    client: "John Doe",
    date: "2025-03-21",
    file: "asd/fdsj/fdsj2.doc",
    location: "USA",
    paymentVerified: false,
    bids: 2,
  },
];

const PostList = () => {
  return (
    <div className="w-full space-y-6">
      {posts.map((post, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">{post.title}</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded-full text-sm">{post.budget}</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>{post.client}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{post.location}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className={`flex items-center text-sm ${
              post.paymentVerified ? "text-green-600" : "text-amber-600"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {post.paymentVerified ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
              {post.paymentVerified ? "Payment Verified" : "Payment Pending"}
            </span>
            
            <span className="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span className="font-medium">{post.bids}</span> Bids
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
