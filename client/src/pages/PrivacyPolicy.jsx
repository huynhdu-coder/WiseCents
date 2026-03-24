export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-heading font-bold text-wisegreen mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-8">Last updated: March 2026</p>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-wisetext mb-2">1. Information We Collect</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            WiseCents collects information you provide directly, such as your name, email address,
            and financial account data linked through Plaid. We also collect usage data to improve
            the application experience.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-wisetext mb-2">2. How We Use Your Data</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your data is used to provide personalized financial insights, power AI-driven
            recommendations, and maintain your account. If you opt in, your transaction history
            may be analyzed to generate spending insights and budget suggestions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-wisetext mb-2">3. Data Sharing</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We do not sell or share your personal data with third parties for marketing purposes.
            Data may be shared with service providers (such as Plaid and Microsoft Azure) solely
            to operate the platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-wisetext mb-2">4. Your Choices</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You can opt out of AI data analysis at any time from the Settings page. You may also
            request deletion of your account and associated data by contacting us.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-wisetext mb-2">5. Data Security</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We use industry-standard encryption and secure cloud infrastructure (Microsoft Azure)
            to protect your data. Plaid access tokens are encrypted and stored securely.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-wisetext mb-2">6. Contact</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you have any questions about this policy, please contact the WiseCents team
            directly by emailing noreply.wisecents@gmail.com .
          </p>
        </section>

        <button
          onClick={() => window.close()}
          className="text-sm text-wisegreen underline hover:text-green-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}