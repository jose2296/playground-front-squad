import { Item } from '@/modules/Daily/Roulette/Roulette';
import { create } from 'zustand';
import rouletteData from '@/data/roulette.json';

const steps = [
    {
        index: 0,
        name: 'Games',
        route: '/games'
    },
    {
        index: 1,
        name: 'Daily',
        route: '/daily'
    },
    {
        index: 2,
        name: 'International Day',
        route: '/international-day'
    }
];

interface Step {
    index: number;
    name: string;
    route: string;
}

interface State {
    steps: Step[];
    currentStep: Step;
    changeStep: (step: Step) => void;
    changeStepByIndex: (index: number) => void;
    nextStep: () => void;
    previousStep: () => void;
}

export const useStore = create<State>()((set) => ({
    steps,
    currentStep: steps[0],
    changeStep: (step) => set(() => ({ currentStep: step })),
    changeStepByIndex: (index) => set(() => ({ currentStep: steps[index] })),
    nextStep: () => set((state) => ({ currentStep: steps[(state.currentStep.index + 1) % steps.length] })),
    previousStep: () => set((state) => ({ currentStep: steps[(state.currentStep.index - 1 + steps.length) % steps.length] })),
}))


interface RouletteState {
    selectedItem: Item | null;
    setSelectedItem: (item: Item) => void;
}
export const useRouletteStore = create<RouletteState>()((set) => ({
    selectedItem: null,
    setSelectedItem: (item) => set(() => ({ selectedItem: item })),
}))