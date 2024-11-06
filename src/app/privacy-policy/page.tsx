"use client";

import Header from "@components/Header";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen font-latoRegular">
      <Header onStartNew={() => {}} showNewChat={false} />
      <div className="mt-10 w-full items-center justify-center flex flex-col">
        <h1 className="text-2xl font-bold">Privacy Policy</h1>

        <div className="mt-10 lg:w-[40%] md:w-[40%] sm:w-[60%] xs:w-[80%] mb-10">
          <ol className="list-decimal space-y-4">
            <li>
              <strong>Introduction</strong>
              <p>
                At KollegeAI, your privacy is of utmost importance to us. This
                Privacy Policy outlines how KollegeAI collects, uses, and
                protects your information in compliance with Indian laws,
                including the Information Technology Act and Digital Personal
                Data Protection Act (DPDPA) 2023, when you interact with our
                platform.
              </p>
            </li>
            <li>
              <strong>Information We Collect</strong>
              <br />
              When you sign up on our platform, we collect the following
              personal information
              <ul className="list-disc ml-6">
                <li>Name</li>
                <li>Email Address</li>
                <li>Mobile Number</li>
                <li>City and State</li>
              </ul>
              This information is required to personalize the experience and
              assist with college-related queries and application processes.
            </li>
            <li>
              <strong>Use of Information</strong>
              <br />
              We use your personal information for the following purposes:
              <ul className="list-disc ml-6">
                <li>
                  To provide personalized responses to your MBA/PGDM-related
                  queries.
                </li>
                <li>
                  To send important notifications, such as application
                  deadlines, updates or offers.
                </li>
                <li>
                  To improve our services based on user preferences and
                  behaviour.
                </li>
                <li>
                  To recommend colleges based on your queries and location.
                </li>
                <li>
                  To comply with legal obligations or resolve disputes, if any.
                </li>
              </ul>
            </li>
            <li>
              <strong>Data Sharing</strong>
              <br />
              We do not share, sell, or rent your personal information to third
              parties without user consent, for marketing purposes. However, we
              may share your information under the following circumstances:
              <ul className="list-disc ml-6">
                <li>
                  With third-party college application portals when you click on
                  a college link to begin the application process.
                </li>
                <li>
                  With service providers who assist in the operation of the
                  platform, such as hosting services, provided they adhere to
                  strict data protection requirements.
                </li>
                <li>
                  If required by law to comply with legal processes,
                  regulations, or government requests.
                </li>
              </ul>
            </li>
            <li>
              <strong>Data Security</strong>
              <p>
                We implement reasonable security measures, such as encryption
                and secure servers, to protect your personal information from
                unauthorized access, alteration, or destruction. However, no
                data transmission over the internet can be guaranteed to be 100%
                secure, so we cannot ensure absolute security.
              </p>
            </li>
            <li>
              <strong>User Rights</strong>
              <br />
              You have the right to:
              <ul className="list-disc ml-6">
                <li>Access the personal information we hold about you.</li>
                <li>
                  Request correction of any inaccurate or incomplete data. s
                </li>
                <li>
                  Request deletion of your personal data, subject to certain
                  legal exceptions.
                </li>
                <li>
                  Opt-out of receiving marketing communications or
                  notifications.
                </li>
              </ul>
              To exercise these rights, please contact us.
            </li>
            <li>
              <strong>Cookies</strong>
              <p>
                Our platform uses cookies to enhance user experience and track
                usage patterns. You can disable cookies through your browser
                settings, though this may limit certain functionalities of the
                platform.
              </p>
            </li>
            <li>
              <strong>Third Party Links</strong>
              <p>
                Our platform may contain links to external websites, such as
                college portals. We are not responsible for the privacy
                practices of these third-party sites. Please review their
                privacy policies before submitting any personal information.
              </p>
            </li>
            <li>
              <strong>Changes to Privacy Policy</strong>
              <p>
                We reserve the right to update this Privacy Policy at any time.
                Any changes will be reflected on this page, and you will be
                notified if the changes are significant.
              </p>
            </li>
            <li>
              <strong>Grievance Redressal</strong>
              <br />
              For any discrepancies or grievances related to data processing,
              users can contact our Grievance Officer. Here is the contact
              information,
              <ul>
                <li>Grievance Officer:</li>
                <li>Email:</li>
                <li>Phone:</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default page;
