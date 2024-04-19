import { Link } from "react-router-dom";

export const Landing = () => {
  return (
    <div>
      <h1>Welcome to Chess</h1>
      <Link to='/game'>Start Game</Link>
    </div>
  );
};
