import {stopOrResumeAnimation, singleAnimationStep, animationStopped} from './game-of-life';
import {createApp} from 'vue/dist/vue.esm-bundler';

const app = createApp({
    data() {
        return {
            stopped: false
        }
    },
    methods: {
        stopOrResume() {
            stopOrResumeAnimation()
            this.stopped = animationStopped()
        },
        singleStep() {
            singleAnimationStep()
        },
    },
    computed: {
        stopOrResumeButtonText() {
            return this.stopped ? "Resume" : "Stop"
        }
    }
});

app.mount("#app")