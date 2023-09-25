import "./FloatingInput.css";

function FloatingInput(props) {
  return (
    <>
      <input
        className="input-boxes"
        type={props.type ? props.type : "text"}
        placeholder="input"
        id={props.id}
      />
      <label for={props.id}>{props.value ? props.value : "input"}</label>
    </>
  );
}

export default FloatingInput;

// the props passed in are neccessary, for example if you dont pass id, then
// a different label will float up.
