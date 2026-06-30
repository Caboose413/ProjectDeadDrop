const DeadDropChapters = (() => {
  const chapters = [
    {
      id: "base",
      context: "base",
      title: "Base Layer",
      depots: [
        { id: "depot01", permissions: "drwxr-x---", description: "grey-market goods manifest" },
        { id: "depot02", permissions: "drwxr-x---", description: "relay data and message pings" },
        { id: "depot04", permissions: "-rw-r-----", description: "relay log depot" }
      ]
    },
    {
      id: "l4-marker",
      context: "l4Marker",
      title: "L4 Marker",
      depots: [
        { id: "depot05", permissions: "-rw-r-----", description: "audio intercept transcript" }
      ]
    },
    {
      id: "field-code",
      context: "fieldCode",
      title: "Field Code",
      depots: [
        { id: "depot06", permissions: "drwxr-x---", description: "L4 CCTV frame analysis" }
      ]
    },
    {
      id: "arc-l5-marker",
      context: "arcL5Marker",
      title: "ARC-L5 Marker",
      depots: [
        { id: "depot07", permissions: "drwxr-x---", description: "Yellow Core rack audit" }
      ]
    },
    {
      id: "yellow-core-buffer",
      context: "l5Hack",
      title: "Yellow Core Buffer",
      depots: [
        { id: "depot03", permissions: "drwxr-x---", description: "banu exchange fragments" }
      ]
    }
  ];

  const persistentEntries = [
    { id: "system", permissions: "drwxr-x---", description: "recovered Stanton navigation index" },
    { id: "operator", permissions: "crw-r-----", description: "unresolved message channel" }
  ];

  function cloneDepot(depot, chapter) {
    return {
      ...depot,
      context: chapter.context,
      chapterId: chapter.id,
      chapterTitle: chapter.title
    };
  }

  function normalizeContexts(contexts = []) {
    const activeContexts = new Set(contexts);
    activeContexts.add("base");
    return activeContexts;
  }

  function getChapters() {
    return chapters.map((chapter) => ({
      ...chapter,
      depots: chapter.depots.map((depot) => ({ ...depot }))
    }));
  }

  function getDepot(id) {
    for (const chapter of chapters) {
      const depot = chapter.depots.find((entry) => entry.id === id);
      if (depot) return cloneDepot(depot, chapter);
    }

    const persistentEntry = persistentEntries.find((entry) => entry.id === id);
    if (persistentEntry) {
      return {
        ...persistentEntry,
        context: "base",
        chapterId: "persistent",
        chapterTitle: "Persistent Tools"
      };
    }

    return null;
  }

  function getDepots(contexts = []) {
    const activeContexts = normalizeContexts(contexts);
    const chapterDepots = chapters.flatMap((chapter) => {
      if (!activeContexts.has(chapter.context)) return [];
      return chapter.depots.map((depot) => cloneDepot(depot, chapter));
    });

    return chapterDepots.concat(persistentEntries.map((entry) => ({
      ...entry,
      context: "base",
      chapterId: "persistent",
      chapterTitle: "Persistent Tools"
    })));
  }

  function depotIsActive(id, contexts = []) {
    return getDepots(contexts).some((depot) => depot.id === id);
  }

  function getActiveChapter(contexts = []) {
    const activeContexts = normalizeContexts(contexts);
    let activeChapter = chapters[0];

    chapters.forEach((chapter) => {
      if (activeContexts.has(chapter.context)) activeChapter = chapter;
    });

    return {
      id: activeChapter.id,
      context: activeChapter.context,
      title: activeChapter.title
    };
  }

  return {
    depotIsActive,
    getActiveChapter,
    getChapters,
    getDepot,
    getDepots
  };
})();
