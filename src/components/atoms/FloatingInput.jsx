import "./FloatingInput.css";

function FloatingInput(props) {
  return (
    <div className="floating-input-container">
      <input
        className="input-boxes"
        type={props.type ? props.type : "text"}
        placeholder={props.placeholder}
        id={props.id}
        name={props.name}
      />
      {/* <label className="floating-label" for={props.id}>
        {props.value ? props.value : "input"}
      </label> */}
    </div>
  );
}

export default FloatingInput;

// the props passed in are neccessary, for example if you dont pass id, then
// a different label will float up.
