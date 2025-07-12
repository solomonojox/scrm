export function Radio({ icon: Icon, label, defaultValue, ...props }) {
  return (
    <div className="relative flex items-center space-x-4">
      <label className="flex items-center">
        <span className="mr-2">{label}</span>
        {Icon && (
          <div className="mr-2">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <div className="flex items-center space-x-3">
          <label className="flex items-center">
            <input
              type="radio"
              name={props.name}
              value="yes"
              defaultChecked={defaultValue === 'yes'} // Set defaultChecked based on value
              className="text-blue-600 focus:ring-blue-500"
              {...props}
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={props.name}
              value="no"
              defaultChecked={defaultValue === 'no'} // Set defaultChecked based on value
              className="text-blue-600 focus:ring-blue-500"
              {...props}
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </label>
    </div>
  );
}