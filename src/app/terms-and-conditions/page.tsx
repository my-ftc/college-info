"use client";

import Header from "@components/Header";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <div className="mt-10 w-full items-center justify-center flex flex-col">
        <h1 className="text-2xl font-bold">Terms & Conditions</h1>

        <div className="mt-10 lg:w-[40%] md:w-[40%] sm:w-[60%] xs:w-[80%] mb-10">
          <ol className="list-decimal space-y-4">
            <li>
              <strong>Acceptance of Terms</strong>
              <p>
                Welcome to KollegeAI. By signing up, accessing its website, and
                using the services provided by <b>KollegeAI</b> (&quot;we,&quot;
                &quot;our,&quot; &quot;us&quot;), you agree to these Terms and
                Conditions (&quot;Terms&quot;). You must accept these Terms to
                proceed with your account creation. Please read them carefully.
              </p>
            </li>
            <li>
              <strong>Eligibility</strong>
              <p>
                To use our services, you must be at least 18 years old or, if
                you are under 18, use our services under the supervision of a
                parent or guardian who agrees to these Terms.
              </p>
            </li>
            <li>
              <strong>User Registration</strong>
              <ol className="list-[lower-alpha] list-inside ml-2 space-y-2">
                <li>
                  When signing up for an account, you are required to provide
                  accurate and complete information, including your name, email
                  address, mobile number, city, and state.
                </li>
                <li>
                  You agree to keep your information updated and accurate.
                </li>
              </ol>
            </li>
            <li>
              <strong>User Obligations</strong>
              <ol className="list-[lower-alpha] list-inside ml-2 space-y-2">
                <li>You agree to use our services only for lawful purposes.</li>
                <li>
                  You agree not to:
                  <ol className="list-[lower-roman] list-inside ml-4 space-y-2">
                    <li>Provide false information.</li>
                    <li>Impersonate another person or entity.</li>
                    <li>
                      Use the platform in a manner that could disrupt or damage
                      the services or network.
                    </li>
                    <li>
                      Collect information about other users without their
                      consent.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              <strong>Account Security</strong>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password. Any activity under your account will be
                considered your responsibility. Please notify us immediately if
                there is any unauthorized use of your account.
              </p>
            </li>
            <li>
              <strong>Service Availability</strong>
              <p>
                We strive to keep the platform accessible, but we do not
                guarantee uninterrupted or error-free operation. We may modify,
                suspend, or discontinue parts or all of the services at any time
                without notice.
              </p>
            </li>
            <li>
              <strong>Use of Services</strong>
              <ol className="list-[lower-alpha] list-inside ml-2 space-y-2">
                <li>
                  Our platform may contain links to third-party websites,
                  including college application portals.
                </li>
                <li>
                  KollegeAI is not responsible for the content, privacy
                  policies, or practices of these external sites. Your
                  interaction with those websites is governed by their
                  respective terms and policies.
                </li>
                <li>
                  We are not responsible for the content or availability of
                  external sites.
                </li>
              </ol>
            </li>
            <li>
              <strong>User Conduct</strong>
              <ol className="list-[lower-alpha] list-inside ml-2 space-y-2">
                <li>
                  Users agree not to use the site for any unlawful purpose.
                </li>
                <li>
                  Users must not attempt to gain unauthorized access to any part
                  of the site.
                </li>
              </ol>
            </li>
            <li>
              <strong>Intellectual Property</strong>
              <ol className="list-[lower-alpha] list-inside ml-2 space-y-2">
                <li>
                  All content on this site is owned by KollegeAI or its
                  licensors.
                </li>
                <li>
                  Users may reproduce, distribute, or create derivative works
                  from any content on this site with attribution to KollegeAI
                </li>
              </ol>
            </li>
            <li>
              <strong>Limitation of Liability</strong>
              <p>
                KollegeAI shall not be liable for any direct, indirect,
                incidental, special, or consequential damages arising out of
                your use or inability to use our services, including any
                unauthorized access to your personal information.
              </p>
            </li>
            <li>
              <strong>Modification of Terms</strong>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of the site constitutes acceptance of any changes.
              </p>
            </li>
            <li>
              <strong>Termination</strong>
              <p>
                We reserve the right to terminate your account or restrict your
                access to our services if you breach these Terms or engage in
                any activity that may harm the platform or other users.
              </p>
            </li>
            <li>
              <strong>Governing Law</strong>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of India. Any disputes arising from these Terms
                shall be subject to the exclusive jurisdiction of the courts in
                Bangalore, India.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default page;
