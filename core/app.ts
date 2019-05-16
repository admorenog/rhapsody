import Kernel from './kernel';

/**
 * Initialize the application
 */

let canLoadCache = true;
Kernel.bootstrap( canLoadCache );

Kernel.windowManager();