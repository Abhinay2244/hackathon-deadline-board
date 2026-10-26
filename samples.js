function localInput(hoursFromNow) {
    const d = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const sampleItems = [
    { id: 'sample-1', name: 'AI Code Sprint', deadline: localInput(10),  // 15h needed > 10h left -> Impossible
      link: 'https://example.com/ai-sprint',
      tasks: { idea: false, build: false, readme: false, demo: false, submit: false } },
    { id: 'sample-2', name: 'IoT Edge Hackathon', deadline: localInput(18), // 12h needed > 60% of 18h -> Tight
      link: 'https://example.com/iot-edge',
      tasks: { idea: true, build: false, readme: false, demo: false, submit: false } },
    { id: 'sample-3', name: 'Global Web3 Build', deadline: localInput(96),  // 9h needed -> Safe
      link: 'https://example.com/web3',
      tasks: { idea: true, build: true, readme: false, demo: false, submit: false } },
    { id: 'sample-4', name: 'GreenTech Challenge', deadline: localInput(200), // 6h needed -> Safe
      link: 'https://example.com/greentech',
      tasks: { idea: true, build: true, readme: true, demo: false, submit: false } }
];