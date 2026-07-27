export interface Certificate {
  name: string;
  image: string;
}

// Dynamically match all image files inside the src/assets/CERTIFICATE directory
const certModules = import.meta.glob<{ default: string }>('../assets/CERTIFICATE/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });

export const certificatesList: Certificate[] = Object.entries(certModules).map(([path, module]) => {
  const filename = path.split('/').pop() || '';
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  
  // Format title: replace hyphens/underscores with spaces, and clean up extra spaces
  const title = nameWithoutExt
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    name: title,
    image: module.default
  };
});
