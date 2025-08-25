//import gobal css 
// Adjust the path as necessary

export default function SwitchToggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} className="toggle-input" />
      <span className="toggle-label"></span>
    </label>
  );
}
