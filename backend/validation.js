export default {
    organization: {
        name: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    author: {
        name: {
            lowerLimit: 1,
            upperLimit: 30
        }
    },
    clip: {
        title: {
            lowerLimit: 1,
            upperLimit: 50
        },
        datetime: {
            limit: 19
        },
        content: {
            lowerLimit: 1,
            upperLimit: 20
        }
    },
    subtitle: {
        content: {
            lowerLimit: 1
        }
    },
    segment: {
        normal: {
            interval: {
                lowerLimit: 1 * 1000,
                upperLimit: 20 * 60 * 1000
            }
        },
        danmaku: {
            interval: {
                lowerLimit: 10 * 1000,
                upperLimit: 10 * 60 * 1000
            }
        }
    }
}