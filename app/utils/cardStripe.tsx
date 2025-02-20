import { FaCreditCard } from "react-icons/fa";

const CreditCard = () => {
  return (
    <div className="w-80 h-48 bg-gray-900 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
      {/* Icône Carte Bancaire */}
      <div className="flex justify-between items-center">
        <FaCreditCard className="text-gray-400 text-3xl" />
        <span className="text-sm font-semibold tracking-wider">VISA</span>
      </div>

      {/* Numéro de carte */}
      <div className="text-xl font-mono tracking-widest text-center">
        4242 4242 4242 4242
      </div>

      {/* Détails */}
      <div className="flex justify-between text-sm mt-2">
        <div>
          <p className="text-gray-400">EXP</p>
          <p>44/44</p>
        </div>
        <div>
          <p className="text-gray-400">CVC</p>
          <p>444</p>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
