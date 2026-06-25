export interface ServiceData {
  id: number;
  title: string;
  shortDesc: string;
  img: string;
  details: string[];
}

export const services: ServiceData[] = [
  {
    id: 0,
    title: 'Component Manufacturing',
    shortDesc: 'We manufacture high-precision CNC turned and machined components for a wide range of industrial applications with strict quality standards.',
    img: '/photos/home/service_cnc_components.png',
    details: [
      'High-precision CNC turned and machined components for diverse industries',
      'Manufactured as per customer drawings and specifications',
      'Wide range of materials including mild steel, alloy steel, and other grades',
      'Strict quality control at every stage of production',
      'Consistent dimensional accuracy and surface finish',
      'Batch production with reliable quality for volume requirements',
    ],
  },
  {
    id: 1,
    title: 'CNC Turning',
    shortDesc: 'Our advanced CNC turning services ensure accurate, consistent and high-quality components with tight tolerances.',
    img: '/photos/home/service_cnc_turning.png',
    details: [
      'Advanced CNC turning for precise and consistent components',
      'Tight tolerance machining for critical applications',
      'Experienced operators and modern machine tools',
      'Capability to handle complex geometries and profiles',
      'Surface finishing as per customer requirements',
      'Efficient production with minimal turnaround time',
    ],
  },
  {
    id: 2,
    title: 'Durable Products',
    shortDesc: 'We use quality raw materials and advanced machining processes to deliver durable and reliable products.',
    img: '/photos/home/service_durable_products.png',
    details: [
      'Manufactured using quality raw materials',
      'Advanced machining processes for enhanced durability',
      'Rigorous quality checks to ensure product longevity',
      'Suitable for demanding industrial applications',
      'Consistent mechanical properties across batches',
      'Reliable performance in service conditions',
    ],
  },
  {
    id: 3,
    title: 'Quality Assurance',
    shortDesc: 'Every component undergoes rigorous inspection and quality checks to ensure dimensional accuracy and superior performance.',
    img: '/photos/home/service_quality_assurance.png',
    details: [
      'Comprehensive inspection at every production stage',
      'Dimensional accuracy verification using precision instruments',
      'Adherence to ISO 9001:2015 quality management standards',
      'Traceability and documentation for quality records',
      'Continuous improvement through feedback and analysis',
      'Commitment to zero-defect manufacturing',
    ],
  },
  {
    id: 4,
    title: 'Precision Machining',
    shortDesc: 'We provide precision machining solutions for custom and complex components as per customer drawings and specifications.',
    img: '/images/precision_matching.jpeg',
    details: [
      'Custom and complex component machining solutions',
      'Manufacturing as per customer drawings and specifications',
      'Advanced CNC machines for high precision',
      'Capability to handle tight tolerances and intricate profiles',
      'Experienced team for process optimization',
      'Prototype development support for new designs',
    ],
  },
  {
    id: 5,
    title: 'Efficient Service',
    shortDesc: 'With modern CNC machines and optimized processes, we ensure efficient production, consistent quality and on-time delivery.',
    img: '/photos/home/service_efficient_production.png',
    details: [
      'Modern CNC machine shop for efficient production',
      'Optimized processes for consistent quality',
      'On-time delivery commitment',
      'Responsive customer support and communication',
      'Flexible production scheduling for urgent requirements',
      'Long-term partnership approach with clients',
    ],
  },
];

export function getServiceById(id: number): ServiceData | undefined {
  return services.find((s) => s.id === id);
}
