/**
 * @file Tab.jsx
 * @description Reusable tab switcher component for form sections
 * @module components/common/Tab
 * 
 * Renders a pill-style tab group for switching between options.
 * Used in signup form for Student/Instructor selection and other
 * multi-option interfaces. Highlights active tab with background
 * color change and smooth transition effects.
 */

export default function Tab({ tabData, field, setField }) {
  return (
    <div
      style={{
        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
      }}
      className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max"
    >
      {
        tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setField(tab.type)}
            className={`${field === tab.type
              ? "bg-richblack-900 text-richblack-5"
              : "bg-transparent text-richblack-200"
              } py-2 px-5 rounded-full transition-all duration-200`}
          >
            {tab?.tabName}
          </button>
        ))}
    </div>
  );
}