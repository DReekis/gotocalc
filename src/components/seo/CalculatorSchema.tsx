import { type CalculatorMeta } from "@/lib/constants";
import { buildSchemaGraph } from "@/lib/seo";

interface Props {
    calc: CalculatorMeta;
}

export default function CalculatorSchema({ calc }: Props) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: buildSchemaGraph(calc) }}
        />
    );
}
