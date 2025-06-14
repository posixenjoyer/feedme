import fs from "fs";
import os from "os";
import path from "path";

type Config = {
	dbUrl: string
	currentUserName: string
};

export function setUser(username: string) {
	const config = readConfig()
	config.currentUserName = username
	writeConfig(config)
}

export function readConfig() {
	const configFile = getConfigFilePath()

	const fileConfig = fs.readFileSync(configFile, "utf-8")
	const rawConfig = JSON.parse(fileConfig)
	if (!rawConfig.current_user_name) {
		rawConfig.current_user_name = "nouser"
	}

	return validateConfig(rawConfig)
}

function validateConfig(rawConfig: any) {
	if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
		throw Error("The db url supplied in the configuration file is invalid!")
	}

	if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== "string") {
		throw Error("The supplied username is not validly formatted.")
	}

	const configData: Config = {
		dbUrl: rawConfig.db_url,
		currentUserName: rawConfig.current_user_name
	};

	return configData
}

function getConfigFilePath() {
	const configFile = ".feedmeconfig.json"
	const configLocation = os.homedir()

	const fullPath = path.join(configLocation, configFile)

	return fullPath
}

function writeConfig(config: Config) {
	const configPath = getConfigFilePath()

	const rawConfig = {
		db_url: config.dbUrl,
		current_user_name: config.currentUserName,
	};

	const configData = JSON.stringify(rawConfig, null, 2)
	fs.writeFileSync(configPath, configData, { encoding: "utf-8" })
}
