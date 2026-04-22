import { create } from 'twrnc';

// Create the customized version with our tailwind.config.js
const tw = create(require('../tailwind.config.js'));

// Export the customized tw function for use across the app
export default tw;
