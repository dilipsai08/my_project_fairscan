import React from "react";
import { Deco } from "./jsx_deco_";

var the_heading_theme="text-label-caps text-on-secondary-container";
var para_decor="text-body-md text-on-surface mt-1 line-clamp-4";
function MediCard({ info }) {
    if (!info) return null;

    return (
        <div className={Deco.AuthHome.ToolCard + " w-full max-w-2xl"}>
            <h2 className={Deco.AuthHome.ToolTitle}>{info.name}</h2>
            <div className="mt-6 flex flex-col gap-4">
                <div>
                    <span className={the_heading_theme}>Price</span>
                    <p className={para_decor}>{info.price}</p>
                </div>
                <div>
                    <span className={the_heading_theme}>Indications & Usage</span>
                    <p className={para_decor}>{info.usage}</p>
                </div>
                <div className="h-px w-full bg-surface-variant/60" />
                <div>
                    <span className={the_heading_theme}>Warnings</span>
                    <p className={para_decor}>{info.warnings}</p>
                </div>
            </div>
        </div>
    );
}

export default MediCard;