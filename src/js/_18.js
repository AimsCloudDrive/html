const cvs = document.querySelector("canvas")
const ctx = cvs.getContext("2d")

function init () {
    cvs.width = window.innerWidth * devicePixelRatio
    cvs.height = window.innerHeight * devicePixelRatio
}

/**
 * 返回指定范围内的随机整数
 * @param {number} min - 最小值(包括)
 * @param {number} max - 最大值(包括)
 * @returns {number} - 随机整数
 */
function getRandomInRange(min, max) {
    // 生成0-1之间的随机小数并缩放到指定范围内整数的个数
    const randomFraction = Math.random() * (max - min + 1);
    // 向下取整并加上最小值，获得所需的随机整数
    return Math.floor(randomFraction) + min;
}

class Point {
    constructor (r = 3) {
        this.r = r;
        this.x = getRandomInRange(0, cvs.width - this.r /2);
        this.y = getRandomInRange(0, cvs.height - this.r /2);
        this.xSpeed = getRandomInRange(-50, 50)
        this.ySpeed = getRandomInRange(-50, 50)
        this.lastDrawTime = null
    }
    draw () {
        // 更新坐标
        if (this.lastDrawTime) {
            const duration = (new Date() - this.lastDrawTime) / 1000
            const xDist = this.xSpeed * duration,
            yDist = this.ySpeed * duration
            let newX = this.x + xDist,
                newY = this.y + yDist
            if (newX < 0) {
                newX = 0
                this.xSpeed = -this.xSpeed
            } else if (newX > cvs.width - this.r /2) {
                newX = cvs.width -this.r /2
                this.xSpeed = -this.xSpeed
            }
            if (newY < 0) {
                newY = 0
                this.ySpeed = -this.ySpeed
            } else if (newY > cvs.height - this.r /2) {
                newY = cvs.height -this.r /2
                this.ySpeed = -this.ySpeed
            }
            this.x = newX
            this.y = newY
        }
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.fillStyle = `rgba(200, 200, 200)`
        ctx.fill()
        this.lastDrawTime = new Date()
    }
}

class Graph {
    constructor (pointNumber = 50, r = 3, maxDist = 300) {
        this.points = new Array(pointNumber).fill(0).map(() => new Point(r))
        this.maxDist = maxDist
    }
    draw () {
        requestAnimationFrame(() => {
            this.draw()
        })
        ctx.clearRect(0, 0, cvs.width, cvs.height)
        for (let i = 0; i < this.points.length; ++i) {
            const point1 = this.points[i]
            point1.draw()
            for (let j = i + 1; j < this.points.length; ++j) {
                const point2 = this.points[j]
                const xSquareDist = (point1.x - point2.x) ** 2
                const ySquareDist = (point1.y - point2.y) ** 2
                const euclideanMetric = Math.sqrt(xSquareDist + ySquareDist)
                if (euclideanMetric > this.maxDist) continue
                ctx.beginPath()
                ctx.moveTo(point1.x, point1.y)
                ctx.lineTo(point2.x, point2.y)
                ctx.closePath()
                ctx.strokeStyle = `rgba(200, 200, 200, ${1 - euclideanMetric / this.maxDist})`
                ctx.stroke()
            }
        }
    }
}

init ()

const graph = new Graph(pointNumber=45)
graph.draw()
