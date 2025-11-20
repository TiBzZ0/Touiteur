import Account from "./Account";

export default function AccountFlow({ container = "accountList", accounts, maxHeight = "calc(100vh - 230px)" }) {
  return (
    <div id={container} style={{ maxHeight, overflowY: "auto" }}>
      {accounts
        .map((account) => (
          <div key={account._id} className="p-4 max-w-2xl mx-auto">
            <Account
              avatar={account.avatar}
              fullName={account.fullName}
              username={account.username}
            />
          </div>
        ))}
    </div>
  );
}