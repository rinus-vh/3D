import JSZip from 'jszip';

/**
 * Recursively searches for a 3D model file in a directory structure
 * @param files Object containing file entries
 * @returns Promise<File | null>
 */
const findModelFile = async (
  files: { [key: string]: any }
): Promise<File | null> => {
  for (const filename in files) {
    const file = files[filename];
    const lowerFilename = filename.toLowerCase();
    
    // Check if it's a valid model file
    if (
      (lowerFilename.endsWith('.fbx') || lowerFilename.endsWith('.3dm')) && 
      !file.dir && 
      !filename.startsWith('__MACOSX')
    ) {
      const blob = await file.async('blob');
      return new File([blob], filename, { type: 'application/octet-stream' });
    }
    
    // If it's a directory, recursively search it
    if (file.dir && !filename.startsWith('__MACOSX')) {
      const subFiles = {};
      const prefix = filename;
      
      // Get all files in this directory
      for (const subFilename in files) {
        // Skip if the subFilename is the same as the prefix to prevent infinite recursion
        if (subFilename === prefix) continue;
        
        if (subFilename.startsWith(prefix)) {
          // Only process files that are actually inside this directory
          const relativePath = subFilename.slice(prefix.length);
          if (relativePath) {
            subFiles[relativePath] = files[subFilename];
          }
        }
      }
      
      // Only recurse if we found valid subfiles
      if (Object.keys(subFiles).length > 0) {
        const result = await findModelFile(subFiles);
        if (result) return result;
      }
    }
  }
  
  return null;
};

/**
 * Extracts the first FBX or 3DM file from a ZIP archive
 */
export const extractModelFromArchive = async (file: File): Promise<{ modelFile: File | null; settings: any | null }> => {
  try {
    if (file.name.endsWith('.zip')) {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      let modelFile = null;
      let settings = null;
      
      // Try to load settings.json
      const settingsFile = contents.files['settings.json'];
      if (settingsFile) {
        const settingsText = await settingsFile.async('text');
        try {
          settings = JSON.parse(settingsText);
        } catch (e) {
          console.error('Failed to parse settings.json:', e);
        }
      }
      
      // Find model file
      modelFile = await findModelFile(contents.files);
      
      return { modelFile, settings };
    }
  } catch (error) {
    console.error('Error extracting archive:', error);
    throw new Error(`Failed to extract archive: ${error.message}`);
  }
  
  return { modelFile: null, settings: null };
};

export const createProjectArchive = async (modelFile: File, settings: any): Promise<Blob> => {
  const zip = new JSZip();
  
  // Add settings file
  zip.file('settings.json', JSON.stringify(settings, null, 2));
  
  // Add model file
  zip.file(modelFile.name, modelFile);
  
  // Generate zip file
  return await zip.generateAsync({ type: 'blob' });
};