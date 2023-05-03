import raw from "../data/course_list.txt";

export interface Track {
    platform: string;
    name: string;
    breadth: number;
    class: string;
}

export interface MissingTrack {
    gap?: number;
    after?: Track;
    before?: Track;
    battle: boolean;
}

const local = false;

export const fetchData = async (): Promise<
    | { tracks: Track[]; missingTracks: MissingTrack[]; arenas: Track[] }
    | undefined
> => {
    let pairs: [number, string][] = [];
    if (!local) {
        let url: string | undefined;
        const data = await (
            await fetch(
                "https://mkt-api3-default-rtdb.firebaseio.com/tour/.json"
            )
        ).json();
        url =
            "https://firebasestorage.googleapis.com/v0/b/mkt-api3.appspot.com/o/ID%20Table%2F" +
            data +
            ".json?alt=media";
        let dataLists: {
            mIdList: { [index: string]: number };
            mKeyList: { [index: string]: string };
        } = { mIdList: {}, mKeyList: {} };
        await fetch(url)
            .then((response) => response.json())
            .then(
                (data: {
                    mIdList: { [index: string]: number };
                    mKeyList: { [index: string]: string };
                }) => {
                    dataLists = data;
                }
            );
        const keys = Object.keys(dataLists.mIdList).filter(
            (key) => Math.floor(dataLists.mIdList[key] / 10000) === 101
        );
        pairs = keys.map((key) => {
            const pair: [number, string] = [
                dataLists.mIdList[key],
                dataLists.mKeyList[key],
            ];
            return pair;
        });
    } else {
        let text = await fetch(raw).then((r) => r.text());

        pairs = text.split("\n").map((line) => {
            const splitLine = line.split(" - ");
            const pair: [number, string] = [
                parseInt(splitLine[0]),
                splitLine[1],
            ];
            return pair;
        });
    }

    let lastNum: number;
    let lastName: string;
    let lastPlatform: string;
    let lastClass: string;
    let tracks: Track[] = [];
    let missingTracks: MissingTrack[] = [];
    pairs.forEach((pair, i) => {
        const splitKey = pair[1].split(/_|R_sub|RX_sub|X_sub|_sub/);
        const courseClass = splitKey[0];
        const platform = splitKey[1].substring(1);
        if (!lastNum || !lastName) {
            lastNum = pair[0];
            lastName = splitKey[2];
            lastPlatform = platform;
            lastClass = courseClass;
        } else if (lastNum && lastName) {
            if (
                (pair[1].endsWith("X_sub") && !pair[1].endsWith("RX_sub")) ||
                (pair[1].endsWith("_sub") && courseClass === "Battle")
            ) {
                tracks.push({
                    breadth: pair[0] - lastNum,
                    platform,
                    name: splitKey[2],
                    class: courseClass,
                });

                lastClass = splitKey[0];
                lastNum = pair[0];

                if (i === pairs.length - 1) {
                    missingTracks.push({
                        before: undefined,
                        after: {
                            name: lastName,
                            platform: lastPlatform,
                            breadth: -1,
                            class: lastClass,
                        },
                        battle: lastClass === "Battle",
                    });
                }
            } else if (!pair[1].includes(lastName)) {
                if (courseClass !== lastClass && lastClass !== "Remix") {
                    missingTracks.push({
                        before: undefined,
                        after: {
                            name: lastName,
                            platform: lastPlatform,
                            breadth: -1,
                            class: lastClass,
                        },
                        battle:
                            courseClass === "Battle" || lastClass === "Battle",
                    });
                } else if (pair[0] - lastNum > 1 && courseClass === lastClass) {
                    missingTracks.push({
                        before: {
                            name: splitKey[2],
                            platform,
                            breadth: -1,
                            class: courseClass,
                        },
                        after: {
                            name: lastName,
                            platform: lastPlatform,
                            breadth: -1,
                            class: lastClass,
                        },
                        gap: pair[0] - lastNum - 1,
                        battle: lastClass === "Battle",
                    });
                }
                lastNum = pair[0];
                lastName = splitKey[2];
                lastPlatform = platform;
                lastClass = splitKey[0];
            } else {
                lastNum = pair[0];
            }
        }
    });

    return { tracks, missingTracks, arenas: [] };
};
