import styles from "./collection.module.scss";

/*
function CollectionPart({ data, type }: { data: CollectionLikeArraysType; type: CollectionType }) {
    const { user } = useAppSelector(state => state.persist.auth);
    const { setContent } = useContext(ModalContext);
    const [addToUserWords] = useAddToUserWordsMutation();

    return (
        <StyledCollectionPart>
            <h3 className="collection-part__title">{`${type}`} words</h3>
            <div className="collection-part__controls">
                <button
                    type="button"
                    disabled={data[type].length === 0}
                    onClick={() => {
                        const updatedWords: WordWithIdType = {};

                        for (const word of data[type]) {
                            const temporary = { ...word };

                            if (type === CollectionType.SELECTED) {
                                Object.assign(temporary, { selected: false });
                            }

                            if (type === CollectionType.LEARNED) {
                                Object.assign(temporary, { learned: false, guessed: 0 });
                            }

                            if (type === CollectionType.DIFFICULT) {
                                Object.assign(temporary, {
                                    difficult: false,
                                    guessed: word.learned ? 3 : 0,
                                });
                            }
                            Object.assign(updatedWords, { [word.id]: temporary });
                        }

                        addToUserWords({
                            userId: user!.localId,
                            data: updatedWords,
                            tokenId: user!.idToken,
                        });
                    }}>
                    <i className="fa-regular fa-trash-can" />
                </button>

                <button
                    type="button"
                    disabled={data[type].length < 10}
                    onClick={() => {
                        setContent(<GamesPanel data={data[type]} group="0" />);
                    }}>
                    <i className="fa-solid fa-puzzle-piece" />
                </button>
            </div>

            <div className="collection-part__container">
                {data[type].length > 0 ? <WordList data={data[type]} /> : <h5>Not a word added</h5>}
            </div>
        </StyledCollectionPart>
    );
}
*/

export default function ProfilePage() {
    //todo

    /*
  
  const { user } = useAppSelector(state => state.persist.auth);
  
      const { data, isLoading, isSuccess } = useGetUserWordsCollectionsQuery({
          userId: user!.localId,
          tokenId: user!.idToken,
      });
  
      const [addToUserWords] = useAddToUserWordsMutation();
  
      if (isLoading) return <Spinner />;
  
      if (isSuccess) {
          return (
              <main className="main">
                  <h2 className="main__title_main">Collection</h2>
                  <StyledCollectionList>
                      <CollectionPart data={data} type={CollectionType.DIFFICULT} />
                      <CollectionPart data={data} type={CollectionType.SELECTED} />
                      <CollectionPart data={data} type={CollectionType.LEARNED} />
                  </StyledCollectionList>
                  <StyledRemoveAllButton
                      type="button"
                      onClick={() => {
                          if (data) {
                              const updatedWords: WordWithIdType = {};
  
                              for (const word of data.all) {
                                  Object.assign(updatedWords, {
                                      [word.id]: {
                                          ...word,
                                          selected: false,
                                          learned: false,
                                          difficult: false,
                                          guessed: 0,
                                      },
                                  });
                              }
  
                              addToUserWords({
                                  userId: user!.localId,
                                  data: updatedWords,
                                  tokenId: user!.idToken,
                              });
                          }
                      }}>
                      <i className="fa-regular fa-trash-can" />
                  </StyledRemoveAllButton>
              </main>
          );
      }
      return <>no Data</>;*/
    return <div className={styles.collection}></div>;
}
