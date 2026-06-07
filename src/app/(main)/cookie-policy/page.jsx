export const metadata = {
  title: "Cookie Policy — McCann & Curran Reality",
  description: "How McCann & Curran Reality Reality Limited uses cookies on its website.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white pt-[72px]">
      <div className="container mx-auto px-6 lg:px-16 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-dark-950 mb-2">Cookie Policy</h1>
        <p className="text-sm text-dark-400 mb-10">Last updated: 1 January 2026</p>

        <div className="space-y-8 text-base text-dark-600 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They help the website remember your
              preferences and improve your experience. Cookies cannot run programs or deliver viruses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">2. Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-dark-100 rounded-xl overflow-hidden">
                <thead className="bg-dark-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-dark-700">Cookie Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-dark-700">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-dark-700">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-dark-700">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  <tr>
                    <td className="px-4 py-3 font-mono">portal_session</td>
                    <td className="px-4 py-3">Essential</td>
                    <td className="px-4 py-3">Maintains your logged-in session on the client portal.</td>
                    <td className="px-4 py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">csrf_token</td>
                    <td className="px-4 py-3">Essential</td>
                    <td className="px-4 py-3">Security token to prevent cross-site request forgery.</td>
                    <td className="px-4 py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">_ga, _gid</td>
                    <td className="px-4 py-3">Analytics</td>
                    <td className="px-4 py-3">Google Analytics — helps us understand how visitors use our website (anonymised).</td>
                    <td className="px-4 py-3">2 years / 24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">cookie_consent</td>
                    <td className="px-4 py-3">Preference</td>
                    <td className="px-4 py-3">Remembers your cookie consent choice.</td>
                    <td className="px-4 py-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">3. Essential Cookies</h2>
            <p>
              Essential cookies are strictly necessary for the website and portal to function. They cannot be disabled. Without
              them, services such as logging in to the client portal would not work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">4. Analytics Cookies</h2>
            <p>
              We use Google Analytics to collect anonymised information about how visitors use our public website. This helps us
              improve content and navigation. No personally identifiable information is collected through analytics cookies.
              You can opt out of Google Analytics at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">tools.google.com/dlpage/gaoptout</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">5. Managing Cookies</h2>
            <p>You can control and delete cookies through your browser settings. Common browser guides:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/manage-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Microsoft Edge</a></li>
            </ul>
            <p className="mt-2">Please note that disabling cookies may affect the functionality of the portal and some pages of this website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">6. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:info@mccannandCurran.com" className="text-primary-600 hover:underline">info@mccannandCurran.com</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
