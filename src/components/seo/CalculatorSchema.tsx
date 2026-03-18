import { type CalculatorMeta } from "@/lib/constants";
import { buildSchemaGraph } from "@/lib/seo";

interface Props {
    calc: CalculatorMeta;
    extraGraph?: Record<string, unknown>[];
}

export default function CalculatorSchema({ calc, extraGraph }: Props) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: buildSchemaGraph(calc, extraGraph),
            }}
        />
    );
}
