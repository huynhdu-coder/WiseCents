export default function AccountCard({ account, onDelete }) {
  return (
    <div className="min-w-[280px] bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition flex flex-col justify-between">

      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {account.name}
        </h3>

        <p className="text-sm text-gray-500 capitalize">
          {account.subtype} • {account.type}
        </p>

        <div className="mt-4">
          <p className="text-xs text-gray-500">Current Balance</p>
          <p className="text-2xl font-bold text-wisegreen">
            ${Number(account.current_balance || 0).toLocaleString()}
          </p>

          {account.available_balance && (
            <>
              <p className="text-xs text-gray-500 mt-2">Available</p>
              <p className="text-lg font-semibold text-gray-700">
                ${Number(account.available_balance).toLocaleString()}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-5 flex justify-between items-center">

        <span className="text-xs bg-wiseyellow text-wisegreen px-3 py-1 rounded-full">
          {account.official_name || account.subtype}
        </span>

        <button
          onClick={() => onDelete(account.account_id)}
          className="text-red-500 text-xs hover:underline"
        >
          Delete
        </button>

      </div>

    </div>
  );
}
