'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function D3Demo() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Cleanup

    const width = 400;
    const height = 300;
    const data = [10, 40, 30, 70, 50, 90, 60];

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const line = d3.line<number>()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveCardinal);

    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "url(#d3-gradient)")
      .attr("stroke-width", 4)
      .attr("d", line);

    // Animation
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

  }, []);

  return (
    <div className="glass-card" style={{ height: '400px' }}>
      <h3 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Intensité d'Usage Produits (D3.js)</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85%' }}>
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 300">
          <defs>
            <linearGradient id="d3-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
