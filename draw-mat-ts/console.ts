/**
 A simplified version of index.ts without svg drawing
*/

import { findMats, getPathsFromStr, Mat, traverseEdges, toScaleAxis, getCurveToNext } from 'flo-mat';

/**
 * Returns an SVG path string of a line.
 * @param ps The line endpoints.
 */
function getLinePathStr(ps: number[][]) {
    let [[x0,y0],[x1,y1]] = ps;
    return `M${x0} ${y0} L${x1} ${y1}`;
}

/**
 * Returns an SVG path string of a quadratic bezier curve.
 * @param ps The quadratic bezier control points.
 */
function getQuadBezierPathStr(ps: number[][]) {
    let [[x0,y0],[x1,y1],[x2,y2]] = ps;
    return `M${x0} ${y0} Q${x1} ${y1} ${x2} ${y2}`;
}

/**
 * Returns an SVG path string of a cubic bezier curve.
 * @param ps The cubic bezier control points.
 */
function getCubicBezierPathStr(ps: number[][]) {
    let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = ps;
    return `M${x0} ${y0} C${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
}

/**
 * Returns a function that prints an array of MAT curves.
 * @param mats An array of MATs to draw.
  */
function printMats(
        mats: Mat[]) {

    mats.forEach(f);

    /**
     * Print a MAT curve 
     */
     function f(mat: Mat) {
        let cpNode = mat.cpNode;
        
        if (!cpNode) { return; }

        let fs = [,,getLinePathStr, getQuadBezierPathStr, getCubicBezierPathStr];

        traverseEdges(cpNode, function(cpNode) {
            if (cpNode.isTerminating()) { return; }
            let bezier = getCurveToNext(cpNode);
            if (!bezier) { return; }

            let points = fs[bezier.length](bezier);
            console.log(points);
        });
    }
}

/**
 * The SVG path string representing our shape.
 */
const svgPathStr = `
        M 144 251
        C 145 169 110 82 227 59 
        C 344 36 429 -46 505 96 
        C 581 238 696 407 554 435 
        C 412 463 191 532 197 442 
        C 203 352 213 363 276 346 
        C 339 329 563 318 437 242 
        C 311 166 302 181 297 314 
        C 292 447 160 585 151 419 
        C 142 253 87.12 312.78 86 314 
        C 87.16 312.74 142.8632 252.2348 144 251 
        z
`;

function main() {
    // Get loops (representing the shape) from some SVG path.
    let bezierLoops = getPathsFromStr(svgPathStr);
      
    // We could also just give an array of linear, quadratic or cubic beziers as 
    // below (all lines in this case). Note that in the below case there is only
    // one array of beziers (forming a single loop shape).
    /*
    bezierLoops = [
        [
            [[50.000, 95.000],[92.797, 63.905]], 
            [[92.797, 63.905],[76.450, 13.594]],
            [[76.450, 13.594],[23.549, 13.594]],
            [[23.549, 13.594],[7.202,  63.90]],
            [[7.202,  63.900],[50.000, 95.000]]
        ]
    ];
    */
        
    // Get MATs from the loops.
    let mats = findMats(bezierLoops, 3);

    // Get the SAT (at scale 1.5) of the MATs (of which there is only 1)
    let sats = mats.map(mat => toScaleAxis(mat, 1.5));

    printMats(sats);
}


main();
