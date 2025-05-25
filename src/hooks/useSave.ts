import { type ITiddlerFields } from 'tw5-typed';
import { ref } from 'vue';

export function useSave() {
  const isSaving = ref(false);
  const error = ref<null | string>(null);

  function saveTiddler(tiddler: Partial<ITiddlerFields>) {
    isSaving.value = true;
    error.value = null;

    try {
      $tw.wiki.addTiddler(tiddler);
      alert('saved');
    } catch (err: any) {
      console.error('Save failed:', err);
      error.value = err?.message || 'Unknown error';
    } finally {
      isSaving.value = false;
    }
  }

  return {
    saveTiddler,
    isSaving,
    error,
  };
}
