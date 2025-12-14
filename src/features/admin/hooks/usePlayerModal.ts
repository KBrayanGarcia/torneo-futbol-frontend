import { useState } from 'react';

export function usePlayerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingId(null);
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
    setEditingId(null);
  };

  return {
    isOpen,
    editingId,
    openCreate,
    openEdit,
    close,
    toggle,
  };
}
