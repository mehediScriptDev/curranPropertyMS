export const metadata = {
  title: "Terms of Use — McCann & Curran Reality",
  description: "Terms and conditions governing use of the McCann & Curran Reality website and client portal.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white pt-[72px]">
      <div className="container mx-auto px-6 lg:px-16 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-dark-950 mb-2">Terms of Use</h1>
        <p className="text-sm text-dark-400 mb-10">Last updated: 1 January 2026</p>

        <div className="space-y-8 text-base text-dark-600 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the McCann &amp; Curran Reality Limited website and client portal (&ldquo;Services&rdquo;), you agree to be
              bound by these Terms of Use. If you do not agree, please do not use our Services. These terms are governed by the
              laws of Ireland.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">2. Use of the Services</h2>
            <p>You agree to use our Services only for lawful purposes and in accordance with these Terms. You must not:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the Services in any way that violates applicable local, national, or international law.</li>
              <li>Transmit unsolicited or unauthorised advertising or promotional material.</li>
              <li>Attempt to gain unauthorised access to any part of our Services, servers, or databases.</li>
              <li>Engage in conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Services.</li>
              <li>Share your portal login credentials with any third party.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">3. Client Portal Access</h2>
            <p>
              Access to the client portal is granted only to authorised landlords, tenants, and staff members of McCann &amp; Curran
              Reality Limited. You are responsible for maintaining the confidentiality of your login credentials. You must notify us
              immediately at <a href="mailto:info@mccannandCurran.com" className="text-primary-600 hover:underline">info@mccannandCurran.com</a> if you suspect any unauthorised use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">4. Intellectual Property</h2>
            <p>
              All content on this website and portal — including text, graphics, logos, and software — is the property of McCann
              &amp; Curran Reality Limited or its content suppliers and is protected by Irish and international copyright law. You may
              not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">5. Accuracy of Information</h2>
            <p>
              While we strive to ensure that information on our website is accurate and up to date, we make no representations or
              warranties of any kind, express or implied, about the completeness or accuracy of the information. The content is
              provided for general information purposes only and does not constitute property, legal, or financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, McCann &amp; Curran Reality Limited shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of, or inability to use, the Services.
              Our total liability in any matter related to these Terms shall not exceed the fees paid by you to us in the
              preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. These links are provided for your convenience only.
              We have no control over the content of those sites and accept no responsibility for them or for any loss
              or damage that may arise from your use of them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">8. Changes to These Terms</h2>
            <p>
              We may revise these Terms of Use at any time. We will post the revised version on this page with an updated date.
              Your continued use of the Services after any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-3">9. Contact</h2>
            <p>
              Questions about these Terms? Contact us at:
            </p>
            <p className="mt-2">
              McCann &amp; Curran Reality Limited<br />
              Lower Camden St, Dublin, D02XE80<br />
              <a href="mailto:info@mccannandCurran.com" className="text-primary-600 hover:underline">info@mccannandCurran.com</a><br />
              <a href="tel:+0498991111" className="text-primary-600 hover:underline">049-899-1111</a>
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
