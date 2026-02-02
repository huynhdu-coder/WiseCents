export default function AccountCard({ account }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>

      <p className="text-sm text-gray-500 capitalize">
        {account.subtype} • {account.type}
      </p>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Current Balance</p>
        <p className="text-2xl font-bold text-wisegreen">
          ${account.balances.current?.toLocaleString()}
        </p>

        {account.balances.available && (
          <>
            <p className="text-xs text-gray-500 mt-2">Available</p>
            <p className="text-lg font-semibold text-gray-700">
              ${account.balances.available?.toLocaleString()}
            </p>
          </>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <span className="text-xs bg-wiseyellow text-wisegreen px-3 py-1 rounded-full">
          {account.official_name || account.subtype}
        </span>
      </div>
    </div>
  );
}
