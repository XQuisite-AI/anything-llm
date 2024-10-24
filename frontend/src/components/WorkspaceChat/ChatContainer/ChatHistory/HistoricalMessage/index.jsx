import React, { memo } from "react";
import { Warning } from "@phosphor-icons/react";
import UserIcon from "../../../../UserIcon";
import Actions from "./Actions";
import renderMarkdown from "@/utils/chat/markdown";
import { userFromStorage } from "@/utils/request";
import Citations from "../Citation";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";
import { EditMessageForm, useEditMessage } from "./Actions/EditMessage";
import { useWatchDeleteMessage } from "./Actions/DeleteMessage";
import TTSMessage from "./Actions/TTSButton";
import brandLogo from '../../../../../media/logo/brantas.png';

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = ({
  uuid = v4(),
  message,
  role,
  workspace,
  sources = [],
  attachments = [],
  error = false,
  feedbackScore = null,
  chatId = null,
  isLastMessage = false,
  regenerateMessage,
  saveEditedMessage,
  forkThread,
}) => {
  const { isEditing } = useEditMessage({ chatId, role });
  const { isDeleted, completeDelete, onEndAnimation } = useWatchDeleteMessage({
    chatId,
    role,
  });
  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  if (!!error) {
    return (
      <div
        key={uuid}
        className={`flex justify-center items-end w-full ${
          role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
        }`}
      >
        <div className="py-8 w-full flex gap-x-5 flex-col">
          <div className="flex gap-x-5">
            <ProfileImage role={role} workspace={workspace} />
            <div className="p-2 rounded-lg bg-red-50 text-red-500">
              <span className="inline-block">
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
              <p className="text-xs font-mono mt-2 border-l-2 border-red-300 pl-2 bg-red-200 p-2 rounded-sm">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (completeDelete) return null;
  return (
    <div
      key={uuid}
      onAnimationEnd={onEndAnimation}
      className={`${
        isDeleted ? "animate-remove" : ""
      } flex justify-center items-end group mb-3 md:rounded-[16px] w-[80%] ${
        role === "user" ? 'self-end' : ''
      }`}
    >
      <div className="py-8 w-full flex gap-x-5 flex-col">
        <div className={`flex gap-x-5 ${role === 'user' ? 'self-end' : ''}`}>
          <div className={`flex flex-col items-center self-end ${role === 'user' ? 'order-2' : 'order-1'}`}>
            <ProfileImage role={role} workspace={workspace} />
            {/* <div className="mt-1 -mb-10">
              <TTSMessage
                slug={workspace?.slug}
                chatId={chatId}
                message={message}
                role={role}
              />
            </div> */}
          </div>
          {isEditing ? (
            <EditMessageForm
              role={role}
              chatId={chatId}
              message={message}
              attachments={attachments}
              adjustTextArea={adjustTextArea}
              saveChanges={saveEditedMessage}
            />
          ) : (
            <div
              className={`overflow-x-scroll break-words no-scroll flex-grow p-3 rounded-xl
                ${role === 'user' ? 'bg-bs-secondary-hover rounded-br-none order-1' : 'bg-bs-primary rounded-bl-none order-2'}
                `}
            >
              <span
                className={`flex flex-col gap-y-1 text-xl ${role == 'user' ? 'text-dark-text' : 'text-white'}`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(renderMarkdown(message)),
                }}
              />
              <ChatAttachments attachments={attachments} />
            </div>
          )}
        </div>
        <div className={`flex gap-x-5 ${role === 'user' ? 'self-end mr-14' : 'ml-14'}`}>
          <Actions
            message={message}
            feedbackScore={feedbackScore}
            chatId={chatId}
            slug={workspace?.slug}
            isLastMessage={isLastMessage}
            regenerateMessage={regenerateMessage}
            isEditing={isEditing}
            role={role}
            forkThread={forkThread}
          />
        </div>
        {role === "assistant" && <Citations sources={sources} />}
      </div>
    </div>
  );
};

function ProfileImage({ role, workspace }) {
  if (role === "assistant") {
    return (
      <div className="relative w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center rounded-full bg-white border">
        <img
          src={brandLogo}
          alt="Workspace profile picture"
          className="w-[20px] h-[20px] object-content"
        />
      </div>
    );
  }

  return (
    <UserIcon
      user={{
        uid: role === "user" ? userFromStorage()?.username : workspace.slug,
      }}
      role={role}
    />
  );
}

export default memo(
  HistoricalMessage,
  // Skip re-render the historical message:
  // if the content is the exact same AND (not streaming)
  // the lastMessage status is the same (regen icon)
  // and the chatID matches between renders. (feedback icons)
  (prevProps, nextProps) => {
    return (
      prevProps.message === nextProps.message &&
      prevProps.isLastMessage === nextProps.isLastMessage &&
      prevProps.chatId === nextProps.chatId
    );
  }
);

function ChatAttachments({ attachments = [] }) {
  if (!attachments.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((item) => (
        <img
          key={item.name}
          src={item.contentString}
          className="max-w-[300px] rounded-md"
        />
      ))}
    </div>
  );
}
