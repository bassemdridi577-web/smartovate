'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

// Generate some sample data if none provided
const generateSampleData = (): HeatmapData[] => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const data: HeatmapData[] = [];
  days.forEach(day => {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day,
        hour,
        value: Math.floor(Math.random() * 100)
      });
    }
  });
  return data;
};

export default function HeatmapChart({ data = generateSampleData() }: { data?: HeatmapData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const container = svgRef.current.parentElement;
    if (!container || !data) return;

    const margin = { top: 30, right: 30, bottom: 30, left: 40 };
    const width = svgRef.current.parentElement?.clientWidth ? svgRef.current.parentElement.clientWidth - margin.left - margin.right : 600;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(hours.map(String))
      .padding(0.05);

    svg.append('g')
      .style('font-size', '10px')
      .style('color', '#000000')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickValues(hours.filter(h => h % 3 === 0).map(String)))
      .select('.domain').remove();

    const y = d3.scaleBand()
      .range([height, 0])
      .domain(days)
      .padding(0.05);

    svg.append('g')
      .style('font-size', '10px')
      .style('color', '#000000')
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain').remove();

    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolatePurples)
      .domain([0, d3.max(data, d => d.value) || 100]);

    // Tooltip setup
    const tooltip = d3.select(container)
      .append('div')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(255, 255, 255, 0.95)')
      .style('backdrop-filter', 'blur(8px)')
      .style('border', '1px solid rgba(0, 0, 0, 0.1)')
      .style('border-radius', '8px')
      .style('padding', '8px 12px')
      .style('color', '#000000')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 10px 15px -3px rgba(0, 0, 0, 0.1)')
      .style('white-space', 'nowrap')
      .style('z-index', '100');

    svg.selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(String(d.hour)) || 0)
      .attr('y', d => y(d.day) || 0)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', d => colorScale(d.value))
      .style('stroke-width', 1)
      .style('stroke', 'none')
      .style('opacity', 0.8)
      .on('mouseover', function(event, d: any) {
        d3.select(this).style('opacity', 1).style('stroke', 'rgba(0,0,0,0.2)');
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: 600; margin-bottom: 2px;">${d.day} à ${d.hour}h00</div>
            <div style="color: #6366f1;">${d.value} utilisateurs actifs</div>
          `);
      })
      .on('mousemove', function(event) {
        const [mx, my] = d3.pointer(event, container);
        tooltip
          .style('left', mx + 'px')
          .style('top', (my - 5) + 'px')
          .style('transform', 'translate(-50%, -100%)');
      })
      .on('mouseleave', function() {
        d3.select(this).style('opacity', 0.8).style('stroke', 'none');
        tooltip.style('opacity', 0);
      });

    // Cleanup tooltip on unmount or re-render
    return () => {
      tooltip.remove();
    };

  }, [data]);

  return (
    <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
