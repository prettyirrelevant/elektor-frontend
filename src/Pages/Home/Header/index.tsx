import logo from "../../../assets/logo/cryptoVote-logo.svg";

const Header = () => {

import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();


  return (
    <div className="py-8 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" />

          <span>CryptoVote</span>
        </div>
        <div>
          <button className="bg-customGray w-32 h-11 rounded-lg">

          <span>Elektor</span>
        </div>
        <div>
          <button onClick={() => navigate('/elections')} className="bg-customGray w-32 h-11 rounded-lg">

            Launch app
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
