#!/usr/local/bin/node
import { app, BrowserWindow } from 'electron';
import Kernel from './kernel';

Kernel.bootstrap( app );