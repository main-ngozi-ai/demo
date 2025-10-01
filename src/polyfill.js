import 'core-js/features/object/assign';
import 'core-js/features/promise';
import 'regenerator-runtime/runtime';
import process from 'process/browser';

// Explicitly expose process to global
window.process = process;