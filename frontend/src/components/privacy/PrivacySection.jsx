
import PropTypes from 'prop-types';
PrivacySection.propTypes = {
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  bg: PropTypes.string,
  reverse: PropTypes.bool,
};

export default function PrivacySection({
  number,
  title,
  children,
  bg = "bg-white",
  reverse = false,
}) {
  return (
    <section
      id={`section-${number}`}
      className={`${bg} border-y-[2px] border-black`}
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div
          className={`grid lg:grid-cols-12 gap-10 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Left Heading Column */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <p className="text-sm font-black tracking-[0.25em] uppercase mb-3">
                Section {number}
              </p>

              <h2 className="text-3xl lg:text-4xl font-black uppercase leading-tight">
                {title}
              </h2>
            </div>
          </div>

          {/* Right Content Column */}
          <div className="lg:col-span-9">
            <div className="text-base leading-8 text-gray-700 space-y-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
