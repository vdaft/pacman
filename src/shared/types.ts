export type LevelData = {
    layout: string[],
    key: LevelKey
}

export type LevelKey = Record<string, {type: string, args: any}>