import styled from '@emotion/styled';
import { Flex } from '@components/common/Flex';
import { Text } from '@components/common/Typo';
import { colors } from '@styles/colors';
import { IoSearch } from 'react-icons/io5';
import { TiDelete } from 'react-icons/ti';
import { useSearchStore } from '@/stores/searchStore';
import { getSearchList } from '@/apis/getSearchList';
import SearchResult from '@/components/search/SearchResult';
import RecentSearchResult from '@/components/search/RecentSearchResult';
import { useState, useEffect } from 'react';
import { ProductType } from '@/assets/types/ProductType';

const Search = () => {
  // 현재 검색어
  const [searchQuery, setSearchQuery] = useState('');
  // 검색 결과
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  // 최근 검색어
  const [recentSearchQueries, setRecentSearchQueries] = useState<string[]>([]);
  
  // 검색어가 변경될 때마다 검색 또는 결과 초기화
  
  // 마운트 시 세션 스토리지에서 최근 검색어 목록 불러오기
  useEffect(() => {
    const recentSearchQueries = JSON.parse(sessionStorage.getItem('recentSearchQueries')) || [];
    setRecentSearchQueries(recentSearchQueries);
  }, []);

  // 세션 스토리지에 최근 검색어 목록 저장
  const saveToSessionStorage = (searchQueries) => {
    sessionStorage.setItem('recentSearchQueries', JSON.stringify(searchQueries));
  }

  const handleSearch = async () => {
    setSearchQuery(searchQuery.toLowerCase());
    const data = await getSearchList(searchQuery);
    setSearchResults(data ?? []);
  };

  const handleSearchButtonClick = () => {
    if (searchQuery) {
      handleSearch();
      //search 버튼을 누르거나, 엔터를 통해 검색하면 최근 검색어에 저징됨
      // 중복 제거 후 최근 검색어 목록에 추가
      addRecentSearchQuery(searchQuery);
    }
  };

  const addRecentSearchQuery = (searchQuery: string) => {
    setRecentSearchQueries((prevQueries) =>
      [...new Set([searchQuery, ...prevQueries])].slice(0, 20)
    );
    // 중복 제거한 최근 검색어 목록을 세션 스토리지에 저장
    saveToSessionStorage(recentSearchQueries);
  }

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <Flex direction="column" justify="flex-start">
      <SearchWrapper
        justify="space-between"
        padding="12px 24px"
        gap={10}
        height="fit-content"
      >
        <InputWrapper
          padding="4px 8px"
          backgroundColor={colors.Gray50}
          justify="space-between"
          height={40}
        >
          <InputButton type="submit" onClick={handleSearchButtonClick}>
            <IoSearch size={22} color={colors.MainColor} />
          </InputButton>
          <Input
            type="text"
            placeholder="검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              //엔터 입력 시 현재 검색어가 최근 검색어에 추가됨
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchButtonClick();
              }
            }}
          />
          {searchQuery && (
            <EraseButton onClick={() => setSearchQuery('')} width="fit-content">
              <TiDelete size={28} color={colors.Gray400} />
            </EraseButton>
          )}
        </InputWrapper>
      </SearchWrapper>
      {searchQuery ? (
        <SearchResult searchResults={searchResults} />
      ) : (
        <RecentSearchResult
          recentSearchQueries={recentSearchQueries}
          setRecentSearchQueries={setRecentSearchQueries}
        />
      )}
    </Flex>
  );
};

const SearchWrapper = styled(Flex)`
  border-bottom: 1px solid ${colors.Gray100};
`;

const InputWrapper = styled(Flex)`
  border-radius: 12px;
  backdrop-filter: blur(8px);
`;

const InputButton = styled.button`
  border: none;
  background-color: transparent;
`;

const Input = styled.input`
  padding: 8px 12px 8px 6px;
  background: none;
  resize: none;
  border: none;
  width: 100%;
  &::placeholder {
    line-height: 150%;
    font-size: 15px;
    font-weight: 500;
    color: ${colors.Gray300};
  }
`;

const EraseButton = styled(Flex)`
  cursor: pointer;
`;

export default Search;
