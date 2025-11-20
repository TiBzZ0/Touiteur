import Touite from "./Touite";

export default function TouiteFlow({ container = "touiteList", touites, onRefresh, maxHeight = "calc(100vh - 230px)" }) {
  return (
    <div id={container} style={{ maxHeight, overflowY: "auto" }}>
      {touites
        .map((touite) => (
          <div key={touite._id} className="p-4 max-w-2xl mx-auto">
            <Touite
              accountId={touite.accountId}
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              fullName={touite.nickname}
              username={touite.username}
              time={`${touite.createdAt}h`}
              content={touite.content}
              media={touite.files.length > 0 ? touite.files : []}
              touiteId={touite._id}
              stats={{ retweets: 99 }}
              onRefresh={onRefresh}
            />
          </div>
        ))}
    </div>
  );
}