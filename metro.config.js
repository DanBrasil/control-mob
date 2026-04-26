const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Adiciona .wasm às extensões resolvidas para suporte ao expo-sqlite na web
config.resolver.assetExts.push("wasm");

module.exports = config;
