window.addEventListener('sessionize.onload', function () {
  // Auto-switch to Friday tab
  const fridayTab = document.querySelector('.sz-tabs__link[href="#sz-tab-45996"]');
  if (fridayTab) {
    fridayTab.click();
    console.log("Switched to Friday tab automatically");
  }

  // Set proper page title and header title regardless of URL params
  setPageTitle();
  
  // Add CNCF branding elements
  addCNCFBranding();
  
  // Enhance session cards with CNCF styling
  enhanceSessionCards();
  
  // Improve submission format tags
  improveSubmissionFormatTags();
  
  // Add speaker avatars to session cards
  loadSpeakerData().then(() => {
    addSpeakerAvatars();
  });
});

function setPageTitle() {
  // Set browser title
  document.title = "KCD Suisse Romande 2026 - Agenda | Kubernetes Community Days";
  
  // Set header title (override any Sessionize title)
  const headerTitle = document.querySelector('header h1');
  if (headerTitle) {
    headerTitle.textContent = 'KCD Suisse Romande 2026';
  }
  
  // Also check for any other title elements that might need updating
  const allTitles = document.querySelectorAll('h1, .sz-title, .title');
  allTitles.forEach(title => {
    if (title.textContent.toLowerCase().includes('agenda') || 
        title.textContent.toLowerCase().includes('sessionize') ||
        title.textContent.trim() === '') {
      title.textContent = 'KCD Suisse Romande 2026';
    }
  });
}

function addCNCFBranding() {
  // Add KCD logo to header
  const header = document.querySelector('header');
  if (header && !header.querySelector('.kcd-logo-link')) {
    // Create logo link wrapper
    const logoLink = document.createElement('a');
    logoLink.className = 'kcd-logo-link';
    logoLink.href = 'https://kcd.cloud-native-romandy.ch/';
    logoLink.target = '_blank';
    logoLink.rel = 'noopener noreferrer';
    logoLink.title = 'Visit KCD Suisse Romande website';
    
    // Create logo element
    const logo = document.createElement('img');
    logo.className = 'kcd-logo';
    logo.src = 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,g_center,q_auto:good/v1/gcs/platform-data-cncf/events/KCD%20Site%20Image_DmI8wrx.png';
    logo.alt = 'KCD Suisse Romande Logo';
    logo.loading = 'eager';
    
    // Handle logo load error gracefully
    logo.onerror = function() {
      console.log('KCD logo failed to load');
      logoLink.style.display = 'none';
    };
    
    // Add logo to link wrapper
    logoLink.appendChild(logo);
    
    // Insert logo link at the beginning of header (like before)
    const headerTitle = header.querySelector('h1');
    if (headerTitle) {
      header.insertBefore(logoLink, headerTitle);
    } else {
      header.prepend(logoLink);
    }
    
    console.log('Logo link created and added to header:', logoLink.href);
  }
  
  // Add view switcher button
  if (header && !header.querySelector('.view-switcher')) {
    const viewSwitcher = document.createElement('a');
    viewSwitcher.className = 'view-switcher';
    viewSwitcher.title = 'Switch between agenda and speaker views';
    
    // Detect current view and set up switcher
    const currentUrl = window.location.href;
    if (currentUrl.includes('SpeakerWall')) {
      viewSwitcher.href = './GridSmart';
      
      const icon = document.createElement('span');
      icon.className = 'view-switcher-icon';
      icon.textContent = '📅';
      viewSwitcher.appendChild(icon);
      viewSwitcher.appendChild(document.createTextNode('Agenda'));
    } else {
      viewSwitcher.href = './SpeakerWall';
      
      const icon = document.createElement('span');
      icon.className = 'view-switcher-icon';
      icon.textContent = '👥';
      viewSwitcher.appendChild(icon);
      viewSwitcher.appendChild(document.createTextNode('Speakers'));
    }
    
    header.appendChild(viewSwitcher);
  }
  
  // Add map button next to view switcher
  if (header && !header.querySelector('.map-link')) {
    const mapLink = document.createElement('button');
    mapLink.className = 'map-link';
    mapLink.title = 'View CERN Science Gateway Map';
    mapLink.textContent = '🗺️ Access';
    mapLink.addEventListener('click', showMapModal);
    
    header.appendChild(mapLink);
  }
}

function enhanceSessionCards() {
  // Add Kubernetes/CNCF themed icons or indicators
  const sessions = document.querySelectorAll('.sz-session__card');
  sessions.forEach(card => {
    // Add subtle CNCF-themed hover effects
    card.addEventListener('mouseenter', function() {
      this.style.borderColor = '#326ce5';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.borderColor = '#e1e8f0';
    });
    
    // Add click listener to enhance modals when opened
    card.addEventListener('click', function() {
      // Try multiple times with increasing delays to ensure modal is ready
      setTimeout(enhanceModal, 50);
      setTimeout(enhanceModal, 200);
      setTimeout(enhanceModal, 500);
    });
  });
  
  // Also set up a MutationObserver to catch modal creation
  setupModalObserver();
}

function setupModalObserver() {
  // Watch for modal container changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          if (node.classList && node.classList.contains('sz-modal-container')) {
            // Modal container was added, try to enhance it
            setTimeout(enhanceModal, 10);
            setTimeout(enhanceModal, 100);
          }
        }
      });
    });
  });
  
  // Start observing
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
}

function enhanceModal() {
  const modal = document.querySelector('.sz-modal-session');
  if (modal && modal.offsetParent !== null) { // Check if modal is actually visible
    console.log('Modal opened, looking for tags to enhance');
    
    // Check if we've already enhanced this modal
    if (modal.dataset.enhanced) {
      return true;
    }
    
    const sessionContainer = modal.querySelector('.sz-session');
    if (!sessionContainer) return false;
    
    // Find all tags in the modal
    const allModalTags = modal.querySelectorAll('.sz-tag');
    console.log('Found', allModalTags.length, 'tags in modal');
    
    // Create container for prominent tags at the top
    const topTagsContainer = document.createElement('div');
    topTagsContainer.className = 'modal-top-tags';
    
    let hasTagsToMove = false;
    
    allModalTags.forEach(tag => {
      const classList = Array.from(tag.classList);
      const hasSubmissionFormat = classList.some(cls => cls.includes('submission_format'));
      const hasLangFlag = classList.some(cls => cls.includes('lang_flag'));
      
      // Also check for keynotes by text content
      const tagText = tag.textContent.trim();
      const isKeynote = tagText.includes('Keynote');
      
      if ((hasSubmissionFormat || hasLangFlag || isKeynote) && !tag.dataset.enhanced) {
        let newText = tag.textContent.trim();
        let icon = '';
        let backgroundColor = '#7b68ee';
        
        if (hasSubmissionFormat || isKeynote) {
          console.log('Found submission format tag:', tag.textContent);
          const originalText = tag.textContent.trim();
          
          // Apply same logic as main page
          if (originalText.includes('Solo Presentation') || originalText.includes('Dual Presentation')) {
            newText = 'Talk';
            icon = '🎤';
            backgroundColor = '#326ce5';
          } else if (originalText.includes('Lightning Talk')) {
            newText = 'LT';
            icon = '⚡';
            backgroundColor = '#ff6b35';
          } else if (originalText.includes('Panel')) {
            newText = 'Panel';
            icon = '💬';
            backgroundColor = '#d63384'; // Vibrant pink/magenta for panels
          } else if (originalText.includes('Workshop')) {
            newText = 'Workshop';
            icon = '🔧';
            backgroundColor = '#7b68ee';
          } else if (originalText.includes('Keynote')) {
            newText = 'Keynote';
            icon = '🎯';
            backgroundColor = '#326ce5'; // Blue like talks
          }
        } else if (hasLangFlag) {
          // Language flag - detect language from emoji
          icon = tag.textContent.trim();
          if (icon === '🇫🇷') {
            newText = 'Français';
          } else if (icon === '🇬🇧' || icon === '🇺🇸') {
            newText = 'English';
          } else {
            newText = 'Language'; // fallback
          }
          backgroundColor = '#326ce5';
        }
        
        // Create new prominent tag
        const newTag = document.createElement('div');
        newTag.className = 'modal-prominent-tag';
        newTag.innerHTML = `${icon} ${newText}`;
        newTag.style.background = backgroundColor;
        
        topTagsContainer.appendChild(newTag);
        
        // Hide original tag
        tag.style.display = 'none';
        tag.dataset.enhanced = 'true';
        
        hasTagsToMove = true;
        console.log('Created prominent tag:', `${icon} ${newText}`);
      }
    });
    
    // Add the container to the top of the session if we have tags
    if (hasTagsToMove) {
      sessionContainer.insertBefore(topTagsContainer, sessionContainer.firstChild);
      
      // Hide the entire original tags container
      const originalTagsContainer = modal.querySelector('.sz-session__tags');
      if (originalTagsContainer) {
        originalTagsContainer.style.display = 'none';
      }
    }

    modal.dataset.enhanced = 'true';
    return true;
  }
  return false;
}

function improveSubmissionFormatTags() {
  // Find all tags and improve their display using same logic as modal
  const allTags = document.querySelectorAll('.sz-tag');
  
  allTags.forEach(tag => {
    if (tag.dataset.enhanced) return; // Skip already enhanced tags
    
    const classList = Array.from(tag.classList);
    const tagText = tag.textContent.trim();
    
    // Detect submission format tags by content
    const isSubmissionFormat = tagText.includes('Presentation') || tagText.includes('Lightning Talk') || 
                               tagText.includes('Panel') || tagText.includes('Workshop') || 
                               tagText.includes('Keynote');
    
    // Detect language flags by emoji content
    const isLangFlag = tagText === '🇫🇷' || tagText === '🇬🇧' || tagText === '🇺🇸';
    
    if (isSubmissionFormat || isLangFlag) {
      let newText = tag.textContent.trim();
      let icon = '';
      let backgroundColor = '#7b68ee';
      
      if (isSubmissionFormat) {
        const originalText = tag.textContent.trim();
        
        // Apply same logic as modal but with darker colors for contrast
        if (originalText.includes('Solo Presentation') || originalText.includes('Dual Presentation')) {
          newText = 'Talk';
          icon = '🎤';
          backgroundColor = '#1a4480'; // Darker blue for contrast
        } else if (originalText.includes('Lightning Talk')) {
          newText = 'LT';
          icon = '⚡';
          backgroundColor = '#e55a28'; // Darker orange
        } else if (originalText.includes('Panel')) {
          newText = 'Panel';
          icon = '💬';
          backgroundColor = '#d63384'; // Vibrant pink/magenta for panels
        } else if (originalText.includes('Workshop')) {
          newText = 'Workshop';
          icon = '🔧';
          backgroundColor = '#5a4fcf'; // Darker purple
        } else if (originalText.includes('Keynote')) {
          newText = 'Keynote';
          icon = '🎯';
          backgroundColor = '#1a4480'; // Same as talks but with different icon
        }
      } else if (isLangFlag) {
        // Language flag - detect language from emoji
        icon = tag.textContent.trim();
        if (icon === '🇫🇷') {
          newText = 'Français';
        } else if (icon === '🇬🇧' || icon === '🇺🇸') {
          newText = 'English';
        } else {
          newText = 'Language'; // fallback
        }
        backgroundColor = '#1a4480'; // Darker blue for contrast
      }
      
      // Update the tag content and styling to match modal style
      tag.innerHTML = `${icon} ${newText}`;
      tag.classList.add('enhanced-tag');
      tag.style.backgroundColor = backgroundColor;
      tag.dataset.enhanced = 'true';
    }
  });
}

// Global speaker data cache
let speakerData = {};

async function loadSpeakerData() {
  try {
    console.log('Loading speaker data from Sessionize API...');
    const response = await fetch('https://sessionize.com/api/v2/k8pdwkg9/view/Speakers');
    const speakers = await response.json();
    
    // Create lookup table by speaker ID
    speakers.forEach(speaker => {
      speakerData[speaker.id] = {
        name: speaker.fullName,
        profilePicture: speaker.profilePicture,
        isTopSpeaker: speaker.isTopSpeaker,
        tagLine: speaker.tagLine || ''
      };
    });
    
    console.log(`Loaded ${speakers.length} speakers from API`);
    return speakerData;
  } catch (error) {
    console.error('Failed to load speaker data:', error);
    return {};
  }
}

function addSpeakerAvatars() {
  // Find all session cards with speakers
  const sessionCards = document.querySelectorAll('.sz-session__card');
  
  sessionCards.forEach(card => {
    if (card.dataset.avatarsAdded) return; // Skip if already processed
    
    // Restructure the card for sidebar layout
    const speakersUl = card.querySelector('.sz-session__speakers');
    if (!speakersUl) return;
    
    const speakerLinks = speakersUl.querySelectorAll('a');
    if (speakerLinks.length === 0) return; // Skip if no speakers
    
    // Create main content wrapper for everything except speakers
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'sz-session__content';
    
    // Move all existing content except speakers to the content wrapper
    const childNodes = Array.from(card.childNodes);
    childNodes.forEach(node => {
      if (node !== speakersUl) {
        contentWrapper.appendChild(node);
      }
    });
    
    // Clear and restructure the card
    card.innerHTML = '';
    card.appendChild(contentWrapper);
    card.appendChild(speakersUl);
    
    // Add avatars inline with each speaker link
    speakerLinks.forEach(link => {
      const speakerId = extractSpeakerId(link);
      if (speakerId && speakerData[speakerId]) {
        const speaker = speakerData[speakerId];
        
        // Create avatar element
        const avatar = document.createElement('img');
        avatar.className = 'speaker-avatar';
        
        // Use profile picture if available, otherwise use conference mascot
        if (speaker.profilePicture && speaker.profilePicture.trim() !== '') {
          avatar.src = speaker.profilePicture;
        } else {
          avatar.src = 'https://i.imgur.com/rvWGx28.png';
          avatar.classList.add('mascot-avatar');
        }
        
        avatar.alt = speaker.name;
        avatar.title = speaker.name;
        
        // Handle image load error - fallback to mascot
        avatar.onerror = function() {
          console.log('Failed to load avatar for:', speaker.name, '- using mascot fallback');
          if (this.src !== 'https://i.imgur.com/rvWGx28.png') {
            this.src = 'https://i.imgur.com/rvWGx28.png';
            this.classList.add('mascot-avatar');
          } else {
            // If even the mascot fails to load, hide the avatar
            this.style.display = 'none';
          }
        };
        
        // Add top speaker indicator if applicable
        if (speaker.isTopSpeaker) {
          avatar.classList.add('top-speaker');
        }
        
        // Create speaker info container
        const speakerInfo = document.createElement('div');
        speakerInfo.className = 'speaker-info';
        // Set onclick like the original link
        speakerInfo.setAttribute('onclick', link.getAttribute('onclick'));
        speakerInfo.style.cursor = 'pointer';

        // Insert avatar info the speaker info container
        speakerInfo.appendChild(avatar);
        
        // Wrap the link in the speaker info container
        speakerInfo.appendChild(link.cloneNode(true));
        
        // Add company/role info under the name
        if (speaker.tagLine) {
          const tagLine = document.createElement('div');
          tagLine.className = 'speaker-tagline';
          tagLine.textContent = speaker.tagLine;
          speakerInfo.appendChild(tagLine);
        }

        // Insert avatar and speaker info into the speaker info container
        const parentLi = link.parentElement;
        if (parentLi) {
          parentLi.innerHTML = ''; // Clear existing content
          parentLi.appendChild(speakerInfo);
        }
      }
    });
    
    card.dataset.avatarsAdded = 'true';
  });
}

function extractSpeakerId(speakerLink) {
  // Extract speaker ID from the onclick attribute
  const onclick = speakerLink.getAttribute('onclick');
  if (onclick) {
    // Match pattern: sessionize.showModal('eventId', 'speaker', 'speakerId')
    const match = onclick.match(/sessionize\.showModal\([^,]*,\s*['"]speaker['"],\s*['"]([^'"]+)['"]\)/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

function showMapModal() {
  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'map-modal-backdrop';
  
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'map-modal';
  
  // Create modal header
  const header = document.createElement('div');
  header.className = 'map-modal-header';
  
  const title = document.createElement('h3');
  title.textContent = 'CERN Science Gateway - Visitor Access Map';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'map-modal-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', closeMapModal);
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Create modal content
  const content = document.createElement('div');
  content.className = 'map-modal-content';
  
  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'map-image-container';
  
  const mapImg = document.createElement('img');
  mapImg.src = 'https://visit.cern/sites/default/files/inline-images/CERN_Science_Gateway_Visitors_Access_Map.png';
  mapImg.alt = 'CERN Science Gateway Visitor Access Map';
  mapImg.className = 'map-image';
  
  // Handle image load error
  mapImg.onerror = function() {
    // Create error message with DOM methods
    const errorP = document.createElement('p');
    errorP.style.textAlign = 'center';
    errorP.style.color = '#666';
    errorP.textContent = 'Sorry, the map could not be loaded. Please visit ';
    
    const visitLink = document.createElement('a');
    visitLink.href = 'https://visit.cern';
    visitLink.target = '_blank';
    visitLink.textContent = 'visit.cern';
    
    const endText = document.createTextNode(' for directions.');
    
    errorP.appendChild(visitLink);
    errorP.appendChild(endText);
    
    imageContainer.innerHTML = '';
    imageContainer.appendChild(errorP);
  };
  
  imageContainer.appendChild(mapImg);
  content.appendChild(imageContainer);
  
  // Add venue information
  const venueInfo = document.createElement('div');
  venueInfo.className = 'venue-info';
  
  const infoTitle = document.createElement('h4');
  infoTitle.textContent = 'KCD Suisse Romande Venues:';
  venueInfo.appendChild(infoTitle);
  
  const venueList = document.createElement('ul');
  
  const auditoriumItem = document.createElement('li');
  auditoriumItem.innerHTML = '';
  const audMarker = document.createElement('span');
  audMarker.className = 'venue-marker';
  audMarker.textContent = '2';
  const audText = document.createTextNode(' Conference Welcome & Auditoriums A, B, and C are at the Auditorium');
  auditoriumItem.appendChild(audMarker);
  auditoriumItem.appendChild(audText);
  
  const globeItem = document.createElement('li');
  const globeMarker = document.createElement('span');
  globeMarker.className = 'venue-marker';
  globeMarker.textContent = '3';
  const globeText = document.createTextNode(' The Globe');
  globeItem.appendChild(globeMarker);
  globeItem.appendChild(globeText);
  
  venueList.appendChild(auditoriumItem);
  venueList.appendChild(globeItem);
  venueInfo.appendChild(venueList);
  
  content.appendChild(venueInfo);
  
  // Assemble modal
  modal.appendChild(header);
  modal.appendChild(content);
  backdrop.appendChild(modal);
  
  // Add to page
  document.body.appendChild(backdrop);
  
  // Close on backdrop click
  backdrop.addEventListener('click', function(e) {
    if (e.target === backdrop) {
      closeMapModal();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', handleMapModalKeydown);
}

function closeMapModal() {
  const backdrop = document.querySelector('.map-modal-backdrop');
  if (backdrop) {
    backdrop.remove();
  }
  document.removeEventListener('keydown', handleMapModalKeydown);
}

function handleMapModalKeydown(e) {
  if (e.key === 'Escape') {
    closeMapModal();
  }
}
