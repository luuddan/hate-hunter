import React, { memo } from "react";
import { Link } from "react-router-dom";
import { scaleLinear } from "d3-scale";
import {
    ZoomableGroup,
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";


const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = num => {
    if (num > 1000000000) {
        return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
        return Math.round(num / 100000) / 10 + "M";
    } else {
        return Math.round(num / 100) / 10 + "K";
    }
};

const colorScale = scaleLinear()
  .domain([1,50, 100])
  .range(["green", "yellow","red"]);

const MapChart = ({ setTooltipContent }) => {
    return (
        <>
            <ComposableMap style={{backgroundColor:"#14abc9", background:"linear-gradient(rgba(52, 217, 159,0.9),transparent)"}} data-tip="" projectionConfig={{ scale: 200 }}>
                {/*<ZoomableGroup>*/}
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map(geo => (
                                <Link to={`/${geo.properties.NAME}`}>
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            const { NAME, POP_EST } = geo.properties;
                                            setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
                                        }}
                                        style={{
                                            default: {
                                                fill: colorScale(geo.properties.POP_EST/1000000),
                                                outline: "none"
                                            },
                                            hover: {
                                                fill: "#F53",
                                                outline: "none"
                                            },
                                            pressed: {
                                                fill: "#E42",
                                                outline: "none"
                                            }
                                        }}
                                    />
                                </Link>
                            ))
                        }
                    </Geographies>
                {/*</ZoomableGroup>*/}
            </ComposableMap>
        </>
    );
};

export default memo(MapChart);
