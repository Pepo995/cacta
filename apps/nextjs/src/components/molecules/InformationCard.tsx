import { AiFillInfoCircle } from "react-icons/ai";

import { Card } from "../atoms/Card";

const InformationCard = ({ text }: { text: string }) => (
  <Card className="flex items-center gap-x-4 rounded-xl border border-info_16 bg-info_8 p-2 px-4 shadow-none">
    <AiFillInfoCircle className="text-info" size={24} />

    <p className="whitespace-pre-line text-xs font-semibold text-info/dark">
      {text}
    </p>
  </Card>
);

export default InformationCard;
