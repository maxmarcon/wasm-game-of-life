import {initCanvasContext, pauseAnimation, singleAnimationStep, animationPaused, nextAnimation} from './game-of-life';
import {createApp} from 'vue/dist/vue.esm-bundler';

const app = createApp({
    data() {
        return {
            stopped: false
        }
    },
    mounted() {
        initCanvasContext(this.$refs.canvas)
        nextAnimation()
    },
    methods: {
        stopOrResume() {
            if (this.stopped) {
                nextAnimation()
                this.stopped = false
            } else {
                pauseAnimation()
                this.stopped = true
            }
        },
        singleStep() {
            singleAnimationStep()
        }
    }
});

app.mount("#main-app")