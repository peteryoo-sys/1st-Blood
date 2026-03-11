export async function exportCanvasAsPng(canvasElement: HTMLElement): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(canvasElement, {
    backgroundColor: '#ffffff',
    scale: 2,
  });
  const link = document.createElement('a');
  link.download = 'design.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
